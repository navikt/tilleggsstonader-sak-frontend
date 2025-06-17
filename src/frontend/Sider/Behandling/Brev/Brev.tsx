import React, { useEffect } from 'react';

import styled from 'styled-components';

import { Select, VStack } from '@navikt/ds-react';
import { ABreakpointLgDown } from '@navikt/ds-tokens/dist/tokens';

import BrevLesevisning from './BrevLesevisning';
import { finnSanityMappe } from './brevUtils';
import { useSendTilBeslutter } from './useSendTilBeslutter';
import { VedtakFerdigstiltModal } from './VedtakFerdigstiltModal';
import { useBehandling } from '../../../context/BehandlingContext';
import { BrevFeilContextProvider } from '../../../context/BrevFeilContext';
import { usePersonopplysninger } from '../../../context/PersonopplysningerContext';
import { useTotrinnskontroll } from '../../../context/TotrinnskontrollContext';
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
import { erProd } from '../../../utils/miljø';
import { TotrinnskontrollStatus } from '../Totrinnskontroll/typer';

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
    const { sendTilBeslutter, visVedtakFerdigstiltModal, lukkVedtakFerdigstiltModal } =
        useSendTilBeslutter();

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
        brukDrafts,
        settBrukDrafts,
    } = useBrev(behandling.stønadstype);

    const { mellomlagretBrev } = useMellomlagrignBrev();

    const { vedtak } = useVedtak();

    const { totrinnskontroll } = useTotrinnskontroll();

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

    const kanSendeKommentarTilBeslutter =
        totrinnskontroll.status === RessursStatus.SUKSESS &&
        totrinnskontroll.data?.status === TotrinnskontrollStatus.TOTRINNSKONTROLL_UNDERKJENT;

    return (
        <Container>
            {behandlingErRedigerbar ? (
                <DataViewer type={'brevmaler'} response={{ brevmaler, mellomlagretBrev }}>
                    {({ brevmaler, mellomlagretBrev }) => (
                        <ToKolonner>
                            <VStack gap="8" align="start">
                                {!erProd() && (
                                    <Select
                                        label="Velg miljø"
                                        onChange={(event) => {
                                            settBrukDrafts(event.target.value === 'true');
                                        }}
                                        value={brukDrafts ? 'true' : ''}
                                    >
                                        <option value="">Prod</option>
                                        <option value="true">Drafts</option>
                                    </Select>
                                )}
                                <BrevMottakere
                                    context={contextBrevmottakere}
                                    kanEndreBrevmottakere={behandlingErRedigerbar}
                                    personopplysninger={mapPersonopplysningerTilPersonopplysningerIBrevmottakere(
                                        personopplysninger
                                    )}
                                />
                                <BrevFeilContextProvider>
                                    <VelgBrevmal
                                        brevmaler={brevmaler}
                                        brevmal={brevmal}
                                        settBrevmal={settBrevmal}
                                    />
                                    <DataViewer
                                        type={'delmaler'}
                                        response={{ malStruktur, vedtak }}
                                    >
                                        {({ malStruktur, vedtak }) => (
                                            <Brevmeny
                                                mal={malStruktur}
                                                behandling={behandling}
                                                mellomlagretBrev={mellomlagretBrev}
                                                settFil={settFil}
                                                vedtak={vedtak}
                                                brevknapp={{
                                                    tittel: 'Send til beslutter',
                                                    onClick: sendTilBeslutter,
                                                    visKnapp: true,
                                                    kanSendeKommentarTilBeslutter:
                                                        kanSendeKommentarTilBeslutter,
                                                }}
                                            />
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
            <VedtakFerdigstiltModal
                visModal={visVedtakFerdigstiltModal}
                lukkModal={lukkVedtakFerdigstiltModal}
            />
        </Container>
    );
};

export default Brev;
