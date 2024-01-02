import React, { useState } from 'react';

import { Button } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { RessursStatus } from '../../../typer/ressurs';
import { Toast } from '../../../typer/toast';
import Brevmeny from '../../Behandling/Brev/Brevmeny';
import useBrev from '../../Behandling/Brev/useBrev';
import VelgBrevmal from '../../Behandling/Brev/VelgBrevmal';

const FrittståendeBrev: React.FC<{ valgtStønadstype: Stønadstype; fagsakId: string }> = ({
    valgtStønadstype,
    fagsakId,
}) => {
    const { request, settToast } = useApp();

    const { brevmaler, brevmal, settBrevmal, malStruktur, fil, settFil } = useBrev(
        valgtStønadstype,
        'FRITTSTAENDE'
    );

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
                if (res.status === RessursStatus.SUKSESS) {
                    settToast(Toast.BREV_SENDT);
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                }
            });
        }
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
                    <DataViewer response={{ malStruktur }}>
                        {({ malStruktur }) => (
                            <Brevmeny
                                mal={malStruktur}
                                mellomlagretBrev={undefined}
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
