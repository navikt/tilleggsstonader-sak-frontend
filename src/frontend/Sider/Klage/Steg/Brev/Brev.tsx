import * as React from 'react';
import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Alert, Button } from '@navikt/ds-react';

import { OmgjørVedtak } from './OmgjørVedtak';
import PdfVisning from './PdfVisning';
import { useApp } from '../../../../context/AppContext';
import BrevMottakere from '../../../../komponenter/Brevmottakere/BrevMottakere';
import { Applikasjonskontekst } from '../../../../komponenter/Brevmottakere/typer';
import DataViewer from '../../../../komponenter/DataViewer';
import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';
import SystemetLaster from '../../../../komponenter/SystemetLaster/SystemetLaster';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../../typer/ressurs';
import { PersonopplysningerIBrevmottakere } from '../../../Behandling/Brev/typer';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import { PersonopplysningerFraKlage } from '../../typer/personopplysningerFraKlage';
import { Vurderingsfelter } from '../Vurdering/vurderingsfelter';
import { VedtakValg } from '../Vurdering/vurderingValg';

const Brevside = styled.div`
    background-color: var(--a-bg-subtle);
    padding: 2rem 2rem 0 2rem;
`;

const BrevContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-gap: 1rem;
    justify-content: space-between;

    @media only screen and (max-width: 1800px) {
        display: flex;
        flex-wrap: wrap;
        gap: 3rem;
    }
`;

const AlertStripe = styled(Alert)`
    margin-top: 2rem;
`;

const StyledKnapp = styled(Button)`
    margin-top: 2rem;
`;

type Utfall = 'IKKE_SATT' | 'LAG_BREV' | 'OMGJØR_VEDTAK';

interface IBrev {
    behandlingId: string;
}

export const Brev: React.FC<IBrev> = ({ behandlingId }) => {
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());

    const {
        hentBehandling,
        hentBehandlingshistorikk,
        behandlingErRedigerbar,
        personopplysningerFraKlageResponse,
    } = useKlagebehandling();
    const navigate = useNavigate();

    const [senderInn, settSenderInn] = useState<boolean>(false);
    const [visModal, settVisModal] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState('');

    const [utfall, settUtfall] = useState<Utfall>('IKKE_SATT');

    const { request } = useApp();

    useEffect(() => {
        request<Vurderingsfelter | undefined, null>(`/api/klage/vurdering/${behandlingId}`).then(
            (response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    if (response.data?.vedtak === VedtakValg.OMGJØR_VEDTAK) {
                        settUtfall('OMGJØR_VEDTAK');
                    } else {
                        settUtfall('LAG_BREV');
                    }
                } else {
                    settFeilmelding(response.frontendFeilmelding);
                }
            }
        );
    }, [behandlingId, request]);

    useEffect(() => {
        if (utfall === 'LAG_BREV') {
            if (behandlingErRedigerbar) {
                request<string, null>(`/api/klage/brev/${behandlingId}`, 'POST').then(
                    (respons: Ressurs<string>) => {
                        settBrevRessurs(respons);
                    }
                );
            } else {
                request<string, null>(`/api/klage/brev/${behandlingId}/pdf`).then(settBrevRessurs);
            }
        }
    }, [behandlingErRedigerbar, behandlingId, request, utfall]);

    const ferdigstill = () => {
        if (senderInn) {
            return;
        }
        settSenderInn(true);
        request<null, null>(`/api/klage/behandling/${behandlingId}/ferdigstill`, 'POST').then(
            (res: RessursSuksess<null> | RessursFeilet) => {
                settSenderInn(false);
                if (res.status === RessursStatus.SUKSESS) {
                    lukkModal();
                    hentBehandling.rerun();
                    hentBehandlingshistorikk.rerun();
                    navigate(`/klagebehandling/${behandlingId}/resultat`);
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                }
            }
        );
    };

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
    };

    const mapPersonopplysningerFraKlageTilPersonopplysningenIBrevmottaker = (
        personopplysninger: PersonopplysningerFraKlage
    ): PersonopplysningerIBrevmottakere => {
        return {
            personIdent: personopplysninger.personIdent,
            navn: personopplysninger.navn,
            harVergemål: personopplysninger.vergemål.length !== 0,
            fullmakt: personopplysninger.fullmakt,
            vergemål: personopplysninger.vergemål,
        };
    };

    if (utfall === 'LAG_BREV') {
        return (
            <Brevside>
                <BrevContainer>
                    <div>
                        {brevRessurs.status === RessursStatus.SUKSESS && (
                            <DataViewer
                                response={{
                                    personopplysningerFraKlageResponse,
                                }}
                            >
                                {({ personopplysningerFraKlageResponse }) => (
                                    <BrevMottakere
                                        behandlingId={behandlingId}
                                        applikasjonskontekst={Applikasjonskontekst.KLAGE}
                                        behandlingErRedigerbar={behandlingErRedigerbar}
                                        personopplysninger={mapPersonopplysningerFraKlageTilPersonopplysningenIBrevmottaker(
                                            personopplysningerFraKlageResponse
                                        )}
                                    />
                                )}
                            </DataViewer>
                        )}
                        {behandlingErRedigerbar && brevRessurs.status === RessursStatus.SUKSESS && (
                            <StyledKnapp
                                variant="primary"
                                size="medium"
                                onClick={() => {
                                    settVisModal(true);
                                }}
                            >
                                Ferdigstill behandling og send brev
                            </StyledKnapp>
                        )}
                    </div>
                    <PdfVisning pdfFilInnhold={brevRessurs} />
                </BrevContainer>
                <ModalWrapper
                    tittel={'Bekreft utsending av brev'}
                    visModal={visModal}
                    onClose={() => lukkModal()}
                    aksjonsknapper={{
                        hovedKnapp: {
                            onClick: () => ferdigstill(),
                            tekst: 'Send brev',
                            disabled: senderInn,
                        },
                        lukkKnapp: { onClick: () => lukkModal(), tekst: 'Avbryt' },
                    }}
                    ariaLabel={'Bekreft ustending av frittstående brev'}
                >
                    {feilmelding && (
                        <AlertStripe variant={'error'}>Utsending feilet.{feilmelding}</AlertStripe>
                    )}
                </ModalWrapper>
            </Brevside>
        );
    } else if (utfall === 'OMGJØR_VEDTAK') {
        return (
            <OmgjørVedtak
                behandlingId={behandlingId}
                ferdigstill={ferdigstill}
                senderInn={senderInn}
            />
        );
    } else {
        return <div>{feilmelding || <SystemetLaster />}</div>;
    }
};
