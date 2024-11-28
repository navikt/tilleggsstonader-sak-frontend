import React, { useEffect } from 'react';

import styled from 'styled-components';

import { VStack } from '@navikt/ds-react';
import { ABreakpointLgDown } from '@navikt/ds-tokens/dist/tokens';

import BrevLesevisning from './BrevLesevisning';
import Brevmeny from './Brevmeny';
import {
    finnSanityMappe,
    mapPersonopplysningerTilPersonopplysningerIBrevmottakere,
} from './brevUtils';
import useBrev from './useBrev';
import useMellomlagrignBrev from './useMellomlagrignBrev';
import VelgBrevmal from './VelgBrevmal';
import { useBehandling } from '../../../context/BehandlingContext';
import { usePersonopplysninger } from '../../../context/PersonopplysningerContext';
import { useVedtak } from '../../../hooks/useVedtak';
import BrevMottakere from '../../../komponenter/Brevmottakere/BrevMottakere';
import { Applikasjonskontekst } from '../../../komponenter/Brevmottakere/typer';
import DataViewer from '../../../komponenter/DataViewer';
import PdfVisning from '../../../komponenter/PdfVisning';
import { RessursStatus } from '../../../typer/ressurs';
import { erVedtakInnvilgelse } from '../../../typer/vedtak/vedtakTilsynBarn';
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

    const { personopplysninger } = usePersonopplysninger();
    const {
        brevmaler,
        brevmal,
        settBrevmal,
        hentBrevmaler,
        hentMalStruktur,
        malStruktur,
        fil,
        settFil,
    } = useBrev(behandling.stønadstype);

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
            hentBrevmaler(finnSanityMappe(behandling.type, vedtak.data.type));
        }
    }, [behandlingErRedigerbar, hentBrevmaler, vedtak, vedtak.status, behandling.type]);

    useEffect(() => {
        if (behandlingErRedigerbar) {
            hentMalStruktur();
        }
    }, [behandlingErRedigerbar, hentMalStruktur]);

    return (
        <Container>
            {behandlingErRedigerbar ? (
                <DataViewer response={{ brevmaler, mellomlagretBrev }}>
                    {({ brevmaler, mellomlagretBrev }) => (
                        <ToKolonner>
                            <VStack gap="8" align="start">
                                <BrevMottakere
                                    context={{
                                        type: Applikasjonskontekst.SAK,
                                        behandlingId: behandling.id,
                                    }}
                                    kanEndreBrevmottakere={behandlingErRedigerbar}
                                    personopplysninger={mapPersonopplysningerTilPersonopplysningerIBrevmottakere(
                                        personopplysninger
                                    )}
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
            ) : (
                <BrevLesevisning />
            )}
        </Container>
    );
};

export default Brev;
