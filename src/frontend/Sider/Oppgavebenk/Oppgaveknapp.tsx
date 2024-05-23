import React from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { MenuElipsisHorizontalCircleIcon } from '@navikt/aksel-icons';
import { Button, Dropdown } from '@navikt/ds-react';

import {
    lagJournalføringUrl,
    oppgaveErJournalføring,
    oppgaveErSaksbehandling,
} from './oppgaveutils';
import { Oppgave } from './typer/oppgave';
import { useApp } from '../../context/AppContext';
import { useOppgave } from '../../context/OppgaveContext';

const TabellKnapp = styled(Button)`
    width: fit-content;
    white-space: nowrap;
`;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
`;

interface Props {
    oppgave: Oppgave;
}

const skalViseFortsettKnapp = (oppgave: Oppgave) =>
    oppgaveErSaksbehandling(oppgave) || oppgaveErJournalføring(oppgave);

const Oppgaveknapp: React.FC<Props> = ({ oppgave }) => {
    const { saksbehandler } = useApp();
    const navigate = useNavigate();
    const {
        settOppgaveTilSaksbehandler,
        tilbakestillFordeling,
        laster,
        settFeilmelding,
        oppdaterOppgaveEtterTilbakestilling,
    } = useOppgave();

    const oppgaveTilordnetInnloggetSaksbehandler =
        oppgave.tilordnetRessurs === saksbehandler.navIdent;

    const gåTilBehandleSakOppgave = (behandlingId: string) => {
        navigate(`/behandling/${behandlingId}`);
    };

    const gåTilJournalføring = () => {
        const journalpostId = oppgave.journalpostId || '';
        const oppgaveId = oppgave.id;
        navigate(lagJournalføringUrl(journalpostId, oppgaveId));
    };

    const gåTilOppgaveUtførelse = () => {
        if (oppgaveErSaksbehandling(oppgave) && oppgave.behandlingId) {
            gåTilBehandleSakOppgave(oppgave.behandlingId);
        } else if (oppgaveErJournalføring(oppgave)) {
            gåTilJournalføring();
        } else {
            // TODO kan legges til senere
            //hentFagsakOgTriggRedirectTilBehandlingsoversikt(utledetFolkeregisterIdent(oppgave));
        }
    };

    const utførHandlingOgHentOppgavePåNytt = (handling: () => Promise<Oppgave>) => () => {
        handling()
            .then((oppdatertOppgave) => oppdaterOppgaveEtterTilbakestilling(oppdatertOppgave))
            .catch((error: Error) => settFeilmelding(error.message));
    };

    const tildelOgGåTilOppgaveutførelse = () =>
        settOppgaveTilSaksbehandler(oppgave)
            .then(gåTilOppgaveUtførelse)
            .catch((e) => settFeilmelding(e.message));

    if (oppgaveTilordnetInnloggetSaksbehandler) {
        return (
            <Container>
                {skalViseFortsettKnapp(oppgave) ? (
                    <TabellKnapp
                        type={'button'}
                        variant={'secondary'}
                        size={'small'}
                        onClick={gåTilOppgaveUtførelse}
                        disabled={laster}
                    >
                        Fortsett
                    </TabellKnapp>
                ) : (
                    oppgave.tilordnetRessurs
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
            </Container>
        );
    } else if (oppgave.tilordnetRessurs) {
        return (
            <Container>
                {oppgave.tilordnetRessurs}
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
            </Container>
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
                {oppgaveErSaksbehandling(oppgave) ? 'Behandle' : 'Tildel meg'}
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
