import React from 'react';

import { Button } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { RessursStatus } from '../../../typer/ressurs';
import Brevmeny from '../../Behandling/Brev/Brevmeny';
import useBrev from '../../Behandling/Brev/useBrev';
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
                // eslint-disable-next-line no-console
                console.log(res);
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
                    <Button onClick={sendBrev}>Send brev</Button>
                </>
            )}
        </DataViewer>
    );
};

export default FrittståendeBrev;
