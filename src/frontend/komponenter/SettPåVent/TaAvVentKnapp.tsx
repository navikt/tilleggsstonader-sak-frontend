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

export const TaAvVentKnapp: React.FC = () => {
    const { request } = useApp();
    const { context, behandlingId } = useSettPåVent();
    const [visTaAvVentModal, settVisTaAvVentModal] = useState<boolean>(false);
    const [visNullstillBehandlingAdvarselModal, settVisNullstillBehandlingAdvarselModal] =
        useState<boolean>(false);
    const [kanIkkeTasAvVentFeilmelding, settKanIkkeTasAvVentFeilmelding] = useState<string>();

    const håndterTaAvVent = () => {
        request<KanTaAvVentResponse, null>(
            `/api/${context}/sett-pa-vent/${behandlingId}/kan-ta-av-vent`
        ).then((resp) => {
            if (resp.status === RessursStatus.SUKSESS) {
                if (resp.data.resultat === 'OK') {
                    settVisTaAvVentModal(true);
                } else if (resp.data.resultat === 'MÅ_NULLSTILLE_BEHANDLING') {
                    settVisNullstillBehandlingAdvarselModal(true);
                } else if (resp.data.resultat === 'ANNEN_AKTIV_BEHANDLING_PÅ_FAGSAKEN') {
                    settKanIkkeTasAvVentFeilmelding(
                        'Det finnes allerede en aktiv behanding på denne fagsaken. Den må ferdigstilles eller settes på vent før denne behandlingen kan tas av vent.'
                    );
                } else if (resp.data.resultat === 'ER_IKKE_PÅ_VENT') {
                    settKanIkkeTasAvVentFeilmelding(
                        'Denne behandlingen er ikke på vent. Vennligst oppdater nettsiden.'
                    );
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

            {visNullstillBehandlingAdvarselModal && (
                <NullstillBehandlingAdvarselModal
                    settVisTaAvVentModal={settVisTaAvVentModal}
                    settVisNullstillBehandlingAdvarselModal={
                        settVisNullstillBehandlingAdvarselModal
                    }
                />
            )}

            {visTaAvVentModal && <TaAvVentModal skjulModal={() => settVisTaAvVentModal(false)} />}
        </>
    );
};
