import React, { useEffect } from 'react';

import styled from 'styled-components';

import { VStack } from '@navikt/ds-react';
import { ABreakpointLgDown } from '@navikt/ds-tokens/dist/tokens';

import BrevLesevisning from './BrevLesevisning';
import Brevmeny from './Brevmeny';
import useBrev from './useBrev';
import useMellomlagrignBrev from './useMellomlagrignBrev';
import VelgBrevmal from './VelgBrevmal';
import { useBehandling } from '../../../context/BehandlingContext';
import { Applikasjonskontekst } from '../../../hooks/useBrevmottakere';
import { useVedtak } from '../../../hooks/useVedtak';
import BrevMottakere from '../../../komponenter/Brevmottakere/BrevMottakere';
import DataViewer from '../../../komponenter/DataViewer';
import PdfVisning from '../../../komponenter/PdfVisning';
import { RessursStatus } from '../../../typer/ressurs';
import { erVedtakInnvilgelse, typeVedtakTilSanitytype } from '../../../typer/vedtak';
import SendTilBeslutterKnapp from '../Totrinnskontroll/SendTilBeslutterKnapp';

const Container = styled.div`
    padding: 2rem;
`;

const ToKolonner = styled.div`
    display: flex;
    gap: 1rem;

    @media (max-width: ${ABreakpointLgDown}) {
        flex-wrap: wrap;
    }
`;

const Brev: React.FC = () => {
    const { behandling, behandlingErRedigerbar } = useBehandling();
    const {
        brevmaler,
        brevmal,
        settBrevmal,
        hentBrevmaler,
        hentMalStruktur,
        malStruktur,
        fil,
        settFil,
    } = useBrev(behandling.stønadstype, behandling);

    const { mellomlagretBrev } = useMellomlagrignBrev();

    const { vedtak } = useVedtak();

    useEffect(() => {
        const brevmalFraMellomlagerErGyldigForResultat =
            mellomlagretBrev.status === RessursStatus.SUKSESS &&
            brevmaler.status === RessursStatus.SUKSESS &&
            brevmaler.data.map((mal) => mal._id).includes(mellomlagretBrev.data.brevmal);

        if (brevmalFraMellomlagerErGyldigForResultat) {
            settBrevmal(mellomlagretBrev.data.brevmal);
        }
    }, [brevmaler, mellomlagretBrev, settBrevmal]);

    useEffect(() => {
        if (behandlingErRedigerbar && vedtak.status === RessursStatus.SUKSESS) {
            hentBrevmaler(typeVedtakTilSanitytype(vedtak.data.type));
        }
    }, [behandlingErRedigerbar, hentBrevmaler, vedtak, vedtak.status]);

    useEffect(() => {
        if (behandlingErRedigerbar) {
            hentMalStruktur();
        }
    }, [behandlingErRedigerbar, hentMalStruktur]);

    return (
        <Container>
            {behandlingErRedigerbar ? (
                <>
                    <DataViewer response={{ brevmaler, mellomlagretBrev }}>
                        {({ brevmaler, mellomlagretBrev }) => (
                            <ToKolonner>
                                <VStack gap="8" align="start">
                                    <BrevMottakere
                                        behandlingId={behandling.id}
                                        applikasjonskontekst={Applikasjonskontekst.SAK}
                                        behandlingErRedigerbar={behandlingErRedigerbar}
                                    />
                                    <VelgBrevmal
                                        brevmaler={brevmaler}
                                        brevmal={brevmal}
                                        settBrevmal={settBrevmal}
                                    />
                                    <DataViewer response={{ malStruktur, vedtak }}>
                                        {({ malStruktur, vedtak }) => (
                                            <>
                                                <Brevmeny
                                                    mal={malStruktur}
                                                    behandlingId={behandling.id}
                                                    mellomlagretBrev={mellomlagretBrev}
                                                    settFil={settFil}
                                                    beregningsresultat={
                                                        erVedtakInnvilgelse(vedtak)
                                                            ? vedtak.beregningsresultat
                                                            : undefined
                                                    }
                                                />
                                                <SendTilBeslutterKnapp />
                                            </>
                                        )}
                                    </DataViewer>
                                </VStack>
                                <PdfVisning pdfFilInnhold={fil} />
                            </ToKolonner>
                        )}
                    </DataViewer>
                </>
            ) : (
                <BrevLesevisning />
            )}
        </Container>
    );
};

export default Brev;
