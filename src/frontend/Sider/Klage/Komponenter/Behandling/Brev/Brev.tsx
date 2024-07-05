import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../../../typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { useApp } from '../../../App/context/AppContext';
import { Alert, Button } from '@navikt/ds-react';
import { useNavigate } from 'react-router-dom';
import { IVurdering, VedtakValg } from '../Vurdering/vurderingValg';
import PdfVisning from './PdfVisning';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import SystemetLaster from '../../../Felles/SystemetLaster/SystemetLaster';
import BrevMottakere from '../Brevmottakere/BrevMottakere';
import { OmgjørVedtak } from './OmgjørVedtak';

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
    } = useBehandling();
    const navigate = useNavigate();

    const { axiosRequest } = useApp();
    const [senderInn, settSenderInn] = useState<boolean>(false);
    const [visModal, settVisModal] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState('');

    const [utfall, settUtfall] = useState<Utfall>('IKKE_SATT');

    const hentVurdering = useCallback(
        (behandlingId: string) => {
            axiosRequest<IVurdering | undefined, null>({
                method: 'GET',
                url: `/api/klage/vurdering/${behandlingId}`,
            }).then((response: RessursSuksess<IVurdering | undefined> | RessursFeilet) => {
                if (response.status === RessursStatus.SUKSESS) {
                    if (response.data?.vedtak === VedtakValg.OMGJØR_VEDTAK) {
                        settUtfall('OMGJØR_VEDTAK');
                    } else {
                        settUtfall('LAG_BREV');
                    }
                } else {
                    settFeilmelding(response.frontendFeilmelding);
                }
            });
        },
        [axiosRequest]
    );

    useEffect(() => {
        hentVurdering(behandlingId);
    }, [behandlingId, hentVurdering]);

    const hentBrev = useCallback(() => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `/api/klage/brev/${behandlingId}/pdf`,
        }).then(settBrevRessurs);
    }, [axiosRequest, behandlingId]);

    const genererBrev = useCallback(() => {
        axiosRequest<string, null>({
            method: 'POST',
            url: `/api/klage/brev/${behandlingId}`,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    }, [axiosRequest, behandlingId]);

    useEffect(() => {
        if (utfall === 'LAG_BREV') {
            if (behandlingErRedigerbar) {
                genererBrev();
            } else {
                hentBrev();
            }
        }
    }, [behandlingErRedigerbar, genererBrev, hentBrev, utfall]);

    const ferdigstill = () => {
        if (senderInn) {
            return;
        }
        settSenderInn(true);
        axiosRequest<null, null>({
            method: 'POST',
            url: `/api/klage/behandling/${behandlingId}/ferdigstill`,
        }).then((res: RessursSuksess<null> | RessursFeilet) => {
            settSenderInn(false);
            if (res.status === RessursStatus.SUKSESS) {
                lukkModal();
                hentBehandling.rerun();
                hentBehandlingshistorikk.rerun();
                navigate(`/klagebehandling/${behandlingId}/resultat`);
            } else {
                settFeilmelding(res.frontendFeilmelding);
            }
        });
    };

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
    };

    if (utfall === 'LAG_BREV') {
        return (
            <Brevside>
                <BrevContainer>
                    <div>
                        {brevRessurs.status === RessursStatus.SUKSESS && (
                            <BrevMottakere behandlingId={behandlingId} />
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
                        marginTop: 4,
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
