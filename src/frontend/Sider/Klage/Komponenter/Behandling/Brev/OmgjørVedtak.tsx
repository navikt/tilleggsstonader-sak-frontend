import * as React from 'react';
import { useEffect, useState } from 'react';
import { Alert, Button } from '@navikt/ds-react';
import { useKlageApp } from '../../../App/context/KlageAppContext';
import { useKlagebehandling } from '../../../App/context/KlagebehandlingContext';
import { byggTomRessurs, Ressurs } from '../../../../../typer/ressurs';
import styled from 'styled-components';
import {
    KanIkkeOppretteRevurderingÅrsak,
    KanOppretteRevurdering,
} from '../../../App/typer/kanOppretteRevurdering';
import DataViewer from '../../../../../komponenter/DataViewer';
import { ModalWrapper } from '../../../../../komponenter/Modal/ModalWrapper';

const AlertContainer = styled.div`
    padding: 2rem;
    max-width: 40rem;
`;

const AlertStripe = styled(Alert)`
    margin-top: 2rem;
`;

const StyledKnapp = styled(Button)`
    margin-top: 2rem;
`;

const KanOppretteRevurderingTekst: React.FC<{ kanOppretteRevurdering: KanOppretteRevurdering }> = ({
    kanOppretteRevurdering,
}) => {
    if (kanOppretteRevurdering.kanOpprettes) {
        return (
            <Alert variant={'info'}>
                Resultatet av klagebehandlingen er at påklaget vedtak skal omgjøres. Når du
                ferdigstiller klagebehandlingen vil det automatisk bli opprettet en
                revurderingsbehandling.
            </Alert>
        );
    } else if (kanOppretteRevurdering.årsak === KanIkkeOppretteRevurderingÅrsak.ÅPEN_BEHANDLING) {
        return (
            <Alert variant={'warning'}>
                Resultatet av klagebehandlingen er at påklaget vedtak skal omgjøres. Det vil ikke
                bli opprettet en revurderingsbehandling automatisk fordi det allerede finnes en åpen
                behandling på bruker.
            </Alert>
        );
    } else {
        return (
            <Alert variant={'warning'}>
                Resultatet av klagebehandlingen er at påklaget vedtak skal omgjøres. En
                revurderingsbehandling for å fatte nytt vedtak blir ikke automatisk opprettet. Dette
                må gjøres manuelt.
            </Alert>
        );
    }
};

export const OmgjørVedtak: React.FC<{
    behandlingId: string;
    ferdigstill: () => void;
    senderInn: boolean;
}> = ({ behandlingId, ferdigstill, senderInn }) => {
    const { axiosRequest } = useKlageApp();
    const { behandlingErRedigerbar } = useKlagebehandling();
    const [visModal, settVisModal] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState('');
    const [kanOppretteRevurdering, settKanOppretteRevurdering] =
        useState<Ressurs<KanOppretteRevurdering>>(byggTomRessurs());

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
    };

    useEffect(() => {
        // if (behandlingErRedigerbar) {
        //     axiosRequest<KanOppretteRevurdering, null>({
        //         method: 'GET',
        //         url: `/api/klage/behandling/${behandlingId}/kan-opprette-revurdering`,
        //     }).then(settKanOppretteRevurdering);
        //     settKanOppretteRevurdering(byggTomRessurs())
        // }
    }, [axiosRequest, behandlingErRedigerbar, behandlingId]);

    if (!behandlingErRedigerbar) {
        return (
            <AlertContainer>
                <Alert variant={'info'}>Brev finnes ikke fordi klagen er tatt til følge.</Alert>
            </AlertContainer>
        );
    }

    // TODO: Når revurderinger støttes, kan det første return-statementet her fjernes. Fjern utkommenteringen i useEffect over.
    return (
        <div>
            {behandlingErRedigerbar && (
                <AlertContainer>
                    <KanOppretteRevurderingTekst kanOppretteRevurdering={{ kanOpprettes: false }} />
                    <StyledKnapp onClick={() => settVisModal(true)}>Ferdigstill</StyledKnapp>
                </AlertContainer>
            )}
            <ModalWrapper
                tittel={'Bekreft ferdigstillelse av klagebehandling'}
                visModal={visModal}
                onClose={() => lukkModal()}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: ferdigstill,
                        tekst: 'Ferdigstill',
                        disabled: senderInn,
                    },
                    lukkKnapp: { onClick: lukkModal, tekst: 'Avbryt' },
                }}
            >
                {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
            </ModalWrapper>
        </div>
    );

    return (
        <DataViewer response={{ kanOppretteRevurdering }}>
            {({ kanOppretteRevurdering }) => (
                <>
                    {behandlingErRedigerbar && (
                        <AlertContainer>
                            <KanOppretteRevurderingTekst
                                kanOppretteRevurdering={kanOppretteRevurdering}
                            />
                            <StyledKnapp onClick={() => settVisModal(true)}>
                                Ferdigstill
                            </StyledKnapp>
                        </AlertContainer>
                    )}
                    <ModalWrapper
                        tittel={'Bekreft ferdigstillelse av klagebehandling'}
                        visModal={visModal}
                        onClose={() => lukkModal()}
                        aksjonsknapper={{
                            hovedKnapp: {
                                onClick: ferdigstill,
                                tekst: 'Ferdigstill',
                                disabled: senderInn,
                            },
                            lukkKnapp: { onClick: lukkModal, tekst: 'Avbryt' },
                        }}
                    >
                        {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
                    </ModalWrapper>
                </>
            )}
        </DataViewer>
    );
};
