import React from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { MenuElipsisHorizontalCircleIcon } from '@navikt/aksel-icons';
import { Button, Dropdown, HStack } from '@navikt/ds-react';

import {
    lagJournalføringUrl,
    saksbehandlerHarSendtTilGodkjenneVedtak,
    oppgaveErJournalføring,
    oppgaveErSaksbehandling,
    oppgaveErSaksbehandlingKlage,
} from './oppgaveutils';
import { Oppgave } from './typer/oppgave';
import { useApp } from '../../context/AppContext';
import { useOppgaveFordeling } from '../../hooks/useOppgaveFordeling';

const TabellKnapp = styled(Button)`
    width: fit-content;
    white-space: nowrap;
`;

interface Props {
    oppgave: Oppgave;
    oppdaterOppgaveEtterOppdatering: (oppgave: Oppgave) => void;
    settFeilmelding: (feilmelding: string) => void;
    laster: boolean;
    settLaster: React.Dispatch<React.SetStateAction<boolean>>;
}

const skalViseFortsettKnapp = (oppgave: Oppgave) =>
    oppgaveErSaksbehandling(oppgave) ||
    oppgaveErSaksbehandlingKlage(oppgave) ||
    oppgaveErJournalføring(oppgave);

const Oppgaveknapp: React.FC<Props> = ({
    oppgave,
    oppdaterOppgaveEtterOppdatering,
    settFeilmelding,
    laster,
    settLaster,
}) => {
    const { saksbehandler } = useApp();
    const navigate = useNavigate();

    const { settOppgaveTilSaksbehandler, tilbakestillFordeling } = useOppgaveFordeling(settLaster);
    const oppgaveTilordnetInnloggetSaksbehandler =
        oppgave.tilordnetRessurs === saksbehandler.navIdent;

    const gåTilBehandleSakOppgave = (behandlingId: string) => {
        navigate(`/behandling/${behandlingId}`);
    };

    const gåTilBehandleKlageSakOppgave = (behandlingId: string) => {
        navigate(`/klagebehandling/${behandlingId}`);
    };

    const gåTilJournalføring = () => {
        const journalpostId = oppgave.journalpostId || '';
        const oppgaveId = oppgave.id;
        navigate(lagJournalføringUrl(journalpostId, oppgaveId));
    };

    const gåTilOppgaveUtførelse = () => {
        if (oppgaveErSaksbehandling(oppgave) && oppgave.behandlingId) {
            gåTilBehandleSakOppgave(oppgave.behandlingId);
        } else if (oppgaveErSaksbehandlingKlage(oppgave) && oppgave.behandlingId) {
            gåTilBehandleKlageSakOppgave(oppgave.behandlingId);
        } else if (oppgaveErJournalføring(oppgave)) {
            gåTilJournalføring();
        } else {
            // TODO kan legges til senere
            //hentFagsakOgTriggRedirectTilBehandlingsoversikt(utledetFolkeregisterIdent(oppgave));
        }
    };

    const utførHandlingOgHentOppgavePåNytt = (handling: () => Promise<Oppgave>) => () => {
        handling()
            .then((oppdatertOppgave) => oppdaterOppgaveEtterOppdatering(oppdatertOppgave))
            .catch((error: Error) => settFeilmelding(error.message));
    };

    const tildelOgGåTilOppgaveutførelse = () =>
        settOppgaveTilSaksbehandler(oppgave)
            .then(gåTilOppgaveUtførelse)
            .catch((e) => settFeilmelding(e.message));

    if (saksbehandlerHarSendtTilGodkjenneVedtak(oppgave, saksbehandler)) {
        return null;
    } else if (oppgaveTilordnetInnloggetSaksbehandler) {
        return (
            <HStack justify={skalViseFortsettKnapp(oppgave) ? 'space-between' : 'end'}>
                {skalViseFortsettKnapp(oppgave) && (
                    <TabellKnapp
                        type={'button'}
                        variant={'secondary'}
                        size={'small'}
                        onClick={gåTilOppgaveUtførelse}
                        disabled={laster}
                    >
                        Fortsett
                    </TabellKnapp>
                )}

                <OppgaveValgMeny
                    valg={[
                        {
                            label: 'Flytt fra meg',
                            onClick: utførHandlingOgHentOppgavePåNytt(() =>
                                tilbakestillFordeling(oppgave)
                            ),
                        },
                    ]}
                />
            </HStack>
        );
    } else if (oppgave.tilordnetRessurs) {
        return (
            <HStack justify={'end'}>
                <OppgaveValgMeny
                    valg={[
                        {
                            label: 'Overta',
                            onClick: utførHandlingOgHentOppgavePåNytt(() =>
                                settOppgaveTilSaksbehandler(oppgave)
                            ),
                        },
                    ]}
                />
            </HStack>
        );
    } else
        return (
            <TabellKnapp
                type={'button'}
                variant={'secondary'}
                size={'small'}
                onClick={tildelOgGåTilOppgaveutførelse}
                disabled={laster}
            >
                {oppgaveErSaksbehandling(oppgave) || oppgaveErSaksbehandlingKlage(oppgave)
                    ? 'Behandle'
                    : 'Tildel meg'}
            </TabellKnapp>
        );
};

type OppgaveValg = { label: string; onClick: () => void };

const OppgaveValgMeny: React.FC<{ valg: OppgaveValg[] }> = ({ valg }) => {
    return (
        <Dropdown>
            <Button
                variant={'tertiary'}
                icon={<MenuElipsisHorizontalCircleIcon />}
                size={'small'}
                as={Dropdown.Toggle}
            />
            <Dropdown.Menu>
                <Dropdown.Menu.List>
                    {valg.map((valg, indeks) => (
                        <Dropdown.Menu.List.Item key={indeks} onClick={valg.onClick}>
                            {valg.label}
                        </Dropdown.Menu.List.Item>
                    ))}
                </Dropdown.Menu.List>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default Oppgaveknapp;
