import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Button, VStack } from '@navikt/ds-react';
import { ABreakpointLgDown } from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import PdfVisning from '../../../komponenter/PdfVisning';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { RessursStatus } from '../../../typer/ressurs';
import Brevmeny from '../../Behandling/Brev/Brevmeny';
import useBrev from '../../Behandling/Brev/useBrev';
import useMellomlagringFrittståendeBrev from '../../Behandling/Brev/useMellomlagringFrittståendeBrev';
import VelgBrevmal from '../../Behandling/Brev/VelgBrevmal';

const ToKolonner = styled.div`
    display: flex;
    gap: 1rem;

    @media (max-width: ${ABreakpointLgDown}) {
        flex-wrap: wrap;
    }
`;

const FrittståendeBrev: React.FC<{
    valgtStønadstype: Stønadstype;
    fagsakId: string;
    settBrevErSendt: () => void;
}> = ({ valgtStønadstype, fagsakId, settBrevErSendt }) => {
    const { request } = useApp();
    const [senderBrev, settSenderBrev] = useState<boolean>(false);

    const {
        brevmaler,
        brevmal,
        settBrevmal,
        malStruktur,
        fil,
        settFil,
        hentMalStruktur,
        hentBrevmaler,
    } = useBrev(valgtStønadstype);

    const { mellomlagretBrev } = useMellomlagringFrittståendeBrev(fagsakId);

    useEffect(() => {
        if (mellomlagretBrev.status === RessursStatus.SUKSESS) {
            settBrevmal(mellomlagretBrev.data.brevmal);
        }
    }, [mellomlagretBrev, settBrevmal]);

    useEffect(() => {
        hentBrevmaler(['FRITTSTAENDE']);
    }, [hentBrevmaler]);

    useEffect(() => {
        if (brevmal) {
            hentMalStruktur();
        }
    }, [brevmal, hentMalStruktur]);

    const [feilmelding, settFeilmelding] = useState<string>();

    const sendBrev = () => {
        if (senderBrev) {
            return;
        }
        if (
            fil.status === RessursStatus.SUKSESS &&
            brevmaler.status === RessursStatus.SUKSESS &&
            brevmal
        ) {
            settSenderBrev(true);
            const brevTittel = brevmaler.data.find((bm) => bm._id === brevmal)
                ?.visningsnavn as string;

            request<null, { pdf: string; tittel: string }>(
                `/api/sak/frittstaende-brev/send/${fagsakId}`,
                'POST',
                {
                    pdf: fil.data,
                    tittel: brevTittel,
                }
            )
                .then((res) => {
                    if (res.status === RessursStatus.SUKSESS) {
                        settBrevErSendt();
                    } else {
                        settFeilmelding(res.frontendFeilmelding);
                    }
                })
                .finally(() => settSenderBrev(false));
        }
    };

    return (
        <DataViewer response={{ brevmaler }}>
            {({ brevmaler }) => (
                <ToKolonner>
                    <VStack gap="8" align="start">
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
                                    settFil={settFil}
                                />
                            )}
                        </DataViewer>
                        {fil.status === RessursStatus.SUKSESS && (
                            <Button onClick={sendBrev} size="small" disabled={senderBrev}>
                                Send brev
                            </Button>
                        )}
                        <Feilmelding variant="alert">{feilmelding}</Feilmelding>
                    </VStack>
                    <PdfVisning pdfFilInnhold={fil} />
                </ToKolonner>
            )}
        </DataViewer>
    );
};

export default FrittståendeBrev;
