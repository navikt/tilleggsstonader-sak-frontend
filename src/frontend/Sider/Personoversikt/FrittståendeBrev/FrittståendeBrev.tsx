import React, { useEffect, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { RessursStatus } from '../../../typer/ressurs';
import Brevmeny from '../../Behandling/Brev/Brevmeny';
import useBrev from '../../Behandling/Brev/useBrev';
import useMellomlagringFrittståendeBrev from '../../Behandling/Brev/useMellomlagringFrittståendeBrev';
import VelgBrevmal from '../../Behandling/Brev/VelgBrevmal';

const FrittståendeBrev: React.FC<{ valgtStønadstype: Stønadstype; fagsakId: string }> = ({
    valgtStønadstype,
    fagsakId,
}) => {
    const { request } = useApp();

    const { brevmaler, brevmal, settBrevmal, malStruktur, fil, settFil } = useBrev(
        valgtStønadstype,
        'FRITTSTAENDE'
    );

    const { mellomlagretBrev } = useMellomlagringFrittståendeBrev(fagsakId);

    useEffect(() => {
        if (mellomlagretBrev.status === RessursStatus.SUKSESS) {
            settBrevmal(mellomlagretBrev.data.brevmal);
        }
    }, [mellomlagretBrev, settBrevmal]);

    const [feilmelding, settFeilmelding] = useState<string>();

    const sendBrev = () => {
        if (fil.status === RessursStatus.SUKSESS && brevmal) {
            request<null, { pdf: string; tittel: string }>(
                `/api/sak/frittstaende-brev/send/${fagsakId}`,
                'POST',
                {
                    pdf: fil.data,
                    tittel: brevmal,
                }
            ).then((res) => {
                // TODO: settToast() ved suksess
                if (res.status !== RessursStatus.SUKSESS) {
                    settFeilmelding(res.frontendFeilmelding);
                }
            });
        }
    };

    return (
        <DataViewer response={{ brevmaler, mellomlagretBrev }}>
            {({ brevmaler, mellomlagretBrev }) => (
                <>
                    <VelgBrevmal
                        brevmaler={brevmaler}
                        brevmal={brevmal}
                        settBrevmal={settBrevmal}
                    />
                    <DataViewer response={{ malStruktur }}>
                        {({ malStruktur }) => (
                            <Brevmeny
                                mal={malStruktur}
                                mellomlagretBrev={mellomlagretBrev}
                                fagsakId={fagsakId}
                                fil={fil}
                                settFil={settFil}
                            />
                        )}
                    </DataViewer>
                    {fil.status === RessursStatus.SUKSESS && (
                        <Button onClick={sendBrev}>Send brev</Button>
                    )}
                    <Feilmelding variant="alert">{feilmelding}</Feilmelding>
                </>
            )}
        </DataViewer>
    );
};

export default FrittståendeBrev;
