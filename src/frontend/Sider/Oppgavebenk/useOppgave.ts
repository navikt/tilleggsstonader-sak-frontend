import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Oppgave } from './typer/oppgave';
import { useApp } from '../../context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../typer/ressurs';

export const useOppgave = (oppgave: Oppgave) => {
    const { request } = useApp();
    const navigate = useNavigate();
    const [feilmelding, settFeilmelding] = useState<string>('');
    const [laster, settLaster] = useState<boolean>(false);
    //const { fagsak, hentFagsak } = useHentFagsak();

    const tildelOppgave = (tilbakestill: boolean = false) => {
        settLaster(true);
        return request<string, null>(
            `/api/sak/oppgave/${oppgave.id}/tildel?versjon=${oppgave.versjon}&tilbakestill=${tilbakestill}`,
            'POST'
        )
            .then((res: RessursSuksess<string> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    return Promise.resolve();
                } else {
                    return Promise.reject(
                        new Error(`Feilet fordeling av oppgave. Feil: ${res.frontendFeilmelding}`)
                    );
                }
            })
            .finally(() => settLaster(false));
    };

    const gåTilBehandleSakOppgave = () => {
        if (laster) return;
        navigate(`/behandling/${oppgave.saksreferanse}`);
    };

    const gåTilJournalføring = (/*type: 'klage' | 'stønad'*/) => {
        /*const journalpostId = oppgave.journalpostId || '';
        const oppgaveId = oppgave.id || '';

        navigate(
            type === 'klage'
                ? lagJournalføringKlageUrl(journalpostId, oppgaveId)
                : lagJournalføringUrl(journalpostId, oppgaveId)
        );*/
    };

    /*const hentFagsakOgTriggRedirectTilBehandlingsoversikt = (personIdent: string) => {
        hentFagsak(personIdent, Stønadstype.OVERGANGSSTØNAD); //TODO: Når vi får behandlingstema på tilbakekrevingsoppgaver vi bruke behandlingstema til å sjekke stønadstype
    };
     */

    /*
    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            navigate(`/person/${fagsak.data.fagsakPersonId}`);
        } else if (erAvTypeFeil(fagsak)) {
            settFeilmelding(
                'Henting av fagsak feilet, prøv på nytt. Feil: ' +
                    (fagsak.frontendFeilmelding || fagsak.errorMelding || 'Ukjent feil')
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fagsak]);
    */

    return {
        feilmelding,
        settFeilmelding,
        gåTilBehandleSakOppgave,
        gåTilJournalføring,
        laster,
        //hentFagsakOgTriggRedirectTilBehandlingsoversikt,
        tildelOppgave,
        tilbakestillTildeling: () => tildelOppgave(true),
    };
};
