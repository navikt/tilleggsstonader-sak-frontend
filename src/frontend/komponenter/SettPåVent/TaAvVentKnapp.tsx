import React, { useState } from 'react';

import { Alert, Button } from '@navikt/ds-react';

import { NullstillBehandlingAdvarselModal } from './NullstillBehandlingAdvarselModal';
import TaAvVentModal from './TaAvVentModal';
import { useApp } from '../../context/AppContext';
import { useSettPåVent } from '../../context/SettPåVentContext';
import { RessursStatus } from '../../typer/ressurs';

type KanTaAvVentResponse = {
    resultat:
        | 'OK'
        | 'MÅ_NULLSTILLE_BEHANDLING'
        | 'ANNEN_AKTIV_BEHANDLING_PÅ_FAGSAKEN'
        | 'ER_IKKE_PÅ_VENT';
};
type ModalSomVises = null | 'TaAvVent' | 'BehandlingenMåNullstillesAdvarsel';

export const TaAvVentKnapp: React.FC = () => {
    const { request } = useApp();
    const { context, behandlingId, hentBehandling } = useSettPåVent();
    const [kanIkkeTasAvVentFeilmelding, settKanIkkeTasAvVentFeilmelding] = useState<string>();

    const [modalSomVises, settModalSomVises] = useState<ModalSomVises>(null);

    const håndterTaAvVent = () => {
        request<KanTaAvVentResponse, null>(
            `/api/${context}/sett-pa-vent/${behandlingId}/kan-ta-av-vent`
        ).then((resp) => {
            if (resp.status === RessursStatus.SUKSESS) {
                if (resp.data.resultat === 'OK') {
                    settModalSomVises('TaAvVent');
                } else if (resp.data.resultat === 'MÅ_NULLSTILLE_BEHANDLING') {
                    settModalSomVises('BehandlingenMåNullstillesAdvarsel');
                } else if (resp.data.resultat === 'ANNEN_AKTIV_BEHANDLING_PÅ_FAGSAKEN') {
                    settKanIkkeTasAvVentFeilmelding(
                        'Det finnes allerede en aktiv behanding på denne fagsaken. Den må ferdigstilles eller settes på vent før denne behandlingen kan tas av vent.'
                    );
                } else if (resp.data.resultat === 'ER_IKKE_PÅ_VENT') {
                    hentBehandling.rerun();
                }
            }
        });
    };

    return (
        <>
            <Button size={'small'} variant={'secondary'} onClick={håndterTaAvVent}>
                Ta av vent
            </Button>

            {kanIkkeTasAvVentFeilmelding && (
                <Alert variant="warning">{kanIkkeTasAvVentFeilmelding}</Alert>
            )}

            {modalSomVises === 'BehandlingenMåNullstillesAdvarsel' && (
                <NullstillBehandlingAdvarselModal
                    bekreftNullstilling={() => settModalSomVises('TaAvVent')}
                    avbryt={() => settModalSomVises(null)}
                />
            )}

            {modalSomVises === 'TaAvVent' && (
                <TaAvVentModal skjulModal={() => settModalSomVises(null)} />
            )}
        </>
    );
};
