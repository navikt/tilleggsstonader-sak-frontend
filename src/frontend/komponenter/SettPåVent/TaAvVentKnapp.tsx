import React, { useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { Button } from '@navikt/ds-react';

import { NullstillBehandlingAdvarselModal } from './NullstillBehandlingAdvarselModal';
import TaAvVentModal from './TaAvVentModal';
import { useApp } from '../../context/AppContext';
import { useSettPåVent } from '../../context/SettPåVentContext';
import { RessursStatus } from '../../typer/ressurs';
import { Toggle } from '../../utils/toggles';
import { Feil, feiletRessursTilFeilmelding } from '../Feil/feilmeldingUtils';

type KanTaAvVentResponse = {
    resultat:
        | 'OK'
        | 'MÅ_NULLSTILLE_BEHANDLING'
        | 'ANNEN_AKTIV_BEHANDLING_PÅ_FAGSAKEN'
        | 'ER_IKKE_PÅ_VENT';
};

export const TaAvVentKnapp: React.FC<{
    settTaAvVentFeil: (feil: Feil | string) => void;
}> = ({ settTaAvVentFeil }) => {
    const { request } = useApp();
    const { context, behandlingId, hentBehandling } = useSettPåVent();

    const [modalSomVises, settModalSomVises] = useState<
        undefined | 'TaAvVentModal' | 'NullstillBehandlingAdvarselModal'
    >();
    const kanHaFlereBehandlingerPerFagsak = useFlag(
        Toggle.KAN_HA_FLERE_BEHANDLINGER_PÅ_SAMME_FAGSAK
    );

    const håndterKanTaAvVent = () => {
        request<KanTaAvVentResponse, null>(
            `/api/${context}/sett-pa-vent/${behandlingId}/kan-ta-av-vent`
        ).then((resp) => {
            if (!kanHaFlereBehandlingerPerFagsak) {
                settModalSomVises('TaAvVentModal');
                return;
            }
            if (resp.status === RessursStatus.SUKSESS) {
                const kanTaAvVentStatus = resp.data.resultat;
                switch (kanTaAvVentStatus) {
                    case 'OK':
                        settModalSomVises('TaAvVentModal');
                        break;
                    case 'MÅ_NULLSTILLE_BEHANDLING':
                        settModalSomVises('NullstillBehandlingAdvarselModal');
                        break;
                    case 'ANNEN_AKTIV_BEHANDLING_PÅ_FAGSAKEN':
                        settTaAvVentFeil(
                            'Det finnes allerede en aktiv behanding på denne fagsaken. Den må ferdigstilles eller settes på vent før denne behandlingen kan tas av vent.'
                        );
                        break;
                    case 'ER_IKKE_PÅ_VENT':
                        hentBehandling.rerun();
                        break;
                }
            } else {
                settTaAvVentFeil(feiletRessursTilFeilmelding(resp));
            }
        });
    };

    return (
        <>
            <Button size={'small'} variant={'secondary'} onClick={håndterKanTaAvVent}>
                Ta av vent
            </Button>
            {modalSomVises === 'NullstillBehandlingAdvarselModal' && (
                <NullstillBehandlingAdvarselModal
                    bekreftNullstilling={() => settModalSomVises('TaAvVentModal')}
                    avbryt={() => settModalSomVises(undefined)}
                />
            )}
            {modalSomVises === 'TaAvVentModal' && (
                <TaAvVentModal skjulModal={() => settModalSomVises(undefined)} />
            )}
        </>
    );
};
