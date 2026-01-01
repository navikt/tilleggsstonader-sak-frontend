import * as React from 'react';
import { useEffect, useState } from 'react';

import { Alert, Button } from '@navikt/ds-react';

import styles from './OmgjørVedtak.module.css';
import { useApp } from '../../../../context/AppContext';
import DataViewer from '../../../../komponenter/DataViewer';
import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import {
    KanIkkeOppretteRevurderingÅrsak,
    KanOppretteRevurdering,
} from '../../typer/kanOppretteRevurdering';

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
    const { behandlingErRedigerbar } = useKlagebehandling();
    const [visModal, settVisModal] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState('');
    const [kanOppretteRevurdering, settKanOppretteRevurdering] =
        useState<Ressurs<KanOppretteRevurdering>>(byggTomRessurs());

    const { request } = useApp();

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
    };

    useEffect(() => {
        if (behandlingErRedigerbar) {
            request<KanOppretteRevurdering, null>(
                `/api/klage/behandling/${behandlingId}/kan-opprette-revurdering`
            ).then(settKanOppretteRevurdering);
        }
    }, [request, behandlingErRedigerbar, behandlingId]);

    if (!behandlingErRedigerbar) {
        return (
            <div className={styles.alertContainer}>
                <Alert variant={'info'}>Brev finnes ikke fordi klagen er tatt til følge.</Alert>
            </div>
        );
    }

    return (
        <DataViewer type={'revurderingsmulighet'} response={{ kanOppretteRevurdering }}>
            {({ kanOppretteRevurdering }) => (
                <>
                    {behandlingErRedigerbar && (
                        <div className={styles.alertContainer}>
                            <KanOppretteRevurderingTekst
                                kanOppretteRevurdering={kanOppretteRevurdering}
                            />
                            <Button onClick={() => settVisModal(true)} className={styles.knapp}>
                                Ferdigstill
                            </Button>
                        </div>
                    )}
                    <ModalWrapper
                        tittel={'Bekreft ferdigstillelse av klagebehandling'}
                        umamiId={'ferdigstillelse-av-klagebehandling'}
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
                        {feilmelding && (
                            <Alert variant={'error'} className={styles.alertStripe}>
                                {feilmelding}
                            </Alert>
                        )}
                    </ModalWrapper>
                </>
            )}
        </DataViewer>
    );
};
