import React, { useEffect } from 'react';

import styled from 'styled-components';

import { VStack } from '@navikt/ds-react';
import { ABreakpointLgDown } from '@navikt/ds-tokens/dist/tokens';

import BrevLesevisning from './BrevLesevisning';
import { finnSanityMappe } from './brevUtils';
import { useBehandling } from '../../../context/BehandlingContext';
import { BrevFeilContextProvider } from '../../../context/ManglendeBrevVariablerContext';
import { usePersonopplysninger } from '../../../context/PersonopplysningerContext';
import { useContextBrevmottakereSak } from '../../../hooks/useBrevmottakere';
import { useVedtak } from '../../../hooks/useVedtak';
import Brevmeny from '../../../komponenter/Brev/Brevmeny';
import { mapPersonopplysningerTilPersonopplysningerIBrevmottakere } from '../../../komponenter/Brev/personopplysninger';
import useBrev from '../../../komponenter/Brev/useBrev';
import useMellomlagrignBrev from '../../../komponenter/Brev/useMellomlagringBrev';
import VelgBrevmal from '../../../komponenter/Brev/VelgBrevmal';
import BrevMottakere from '../../../komponenter/Brevmottakere/BrevMottakere';
import DataViewer from '../../../komponenter/DataViewer';
import PdfVisning from '../../../komponenter/PdfVisning';
import { RessursStatus } from '../../../typer/ressurs';
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
    const contextBrevmottakere = useContextBrevmottakereSak(behandling.id);

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
    }, [behandlingErRedigerbar, hentBrevmaler, vedtak, behandling.type, behandling.stønadstype]);

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
                                    context={contextBrevmottakere}
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
                                <BrevFeilContextProvider>
                                    <DataViewer response={{ malStruktur, vedtak }}>
                                        {({ malStruktur, vedtak }) => (
                                            <>
                                                <Brevmeny
                                                    mal={malStruktur}
                                                    behandling={behandling}
                                                    mellomlagretBrev={mellomlagretBrev}
                                                    settFil={settFil}
                                                    vedtak={vedtak}
                                                />
                                                <SendTilBeslutterKnapp />
                                            </>
                                        )}
                                    </DataViewer>
                                </BrevFeilContextProvider>
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
