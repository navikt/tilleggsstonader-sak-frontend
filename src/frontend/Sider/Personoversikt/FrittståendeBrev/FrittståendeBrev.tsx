import React, { useEffect, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { byggTomRessurs, RessursStatus } from '../../../typer/ressurs';
import { Toast } from '../../../typer/toast';
import Brevmeny from '../../Behandling/Brev/Brevmeny';
import useBrev from '../../Behandling/Brev/useBrev';
import useMellomlagringFrittståendeBrev from '../../Behandling/Brev/useMellomlagringFrittståendeBrev';
import VelgBrevmal from '../../Behandling/Brev/VelgBrevmal';

const FrittståendeBrev: React.FC<{ valgtStønadstype: Stønadstype; fagsakId: string }> = ({
    valgtStønadstype,
    fagsakId,
}) => {
    const { request, settToast } = useApp();

    const { brevmaler, brevmal, settBrevmal, malStruktur, settMalStruktur, fil, settFil } = useBrev(
        valgtStønadstype,
        'FRITTSTAENDE'
    );

    const { mellomlagretBrev, settMellomlagretBrev } = useMellomlagringFrittståendeBrev(fagsakId);

    useEffect(() => {
        if (mellomlagretBrev.status === RessursStatus.SUKSESS) {
            settBrevmal(mellomlagretBrev.data.brevmal);
        }
    }, [mellomlagretBrev, settBrevmal]);

    const [feilmelding, settFeilmelding] = useState<string>();

    const sendBrev = () => {
        if (
            fil.status === RessursStatus.SUKSESS &&
            brevmaler.status === RessursStatus.SUKSESS &&
            brevmal
        ) {
            const brevTittel = brevmaler.data.find((bm) => bm._id === brevmal)
                ?.visningsnavn as string;

            request<null, { pdf: string; tittel: string }>(
                `/api/sak/frittstaende-brev/send/${fagsakId}`,
                'POST',
                {
                    pdf: fil.data,
                    tittel: brevTittel,
                }
            ).then((res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    nullstillBrev();
                    settToast(Toast.BREV_SENDT);
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                }
            });
        }
    };

    const nullstillBrev = () => {
        settBrevmal(undefined);
        settMalStruktur(byggTomRessurs());
        settMellomlagretBrev(byggTomRessurs());
    };

    return (
        <DataViewer response={{ brevmaler }}>
            {({ brevmaler }) => (
                <>
                    <VelgBrevmal
                        brevmaler={brevmaler}
                        brevmal={brevmal}
                        settBrevmal={settBrevmal}
                    />
                    <DataViewer response={{ malStruktur, mellomlagretBrev }}>
                        {({ malStruktur, mellomlagretBrev }) => (
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
