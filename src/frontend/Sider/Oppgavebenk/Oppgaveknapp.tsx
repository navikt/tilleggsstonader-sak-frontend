import React from 'react';

import styled from 'styled-components';

import { MenuElipsisHorizontalCircleIcon } from '@navikt/aksel-icons';
import { Button, Dropdown } from '@navikt/ds-react';

import {
    oppgaveErJournalførKlage,
    oppgaveErKlage,
    oppgaveErSaksbehandling,
    oppgaveErTilbakekreving,
    oppgaveKanJournalføres,
} from './oppgaveutils';
import { Oppgave } from './typer/oppgave';
import { useOppgave } from './useOppgave';
import { useApp } from '../../context/AppContext';

const TabellKnapp = styled(Button)`
    width: fit-content;
    white-space: nowrap;
`;

const FlexContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
`;

interface Props {
    oppgave: Oppgave;
    hentOppgavePåNytt: () => void;
    settFeilmelding: (feilmelding: string) => void;
}

const skalViseFortsettKnapp = (oppgave: Oppgave) =>
    oppgaveErSaksbehandling(oppgave) ||
    oppgaveErJournalførKlage(oppgave) ||
    oppgaveKanJournalføres(oppgave) ||
    oppgaveErKlage(oppgave) ||
    oppgaveErTilbakekreving(oppgave);

const Oppgaveknapp: React.FC<Props> = ({ oppgave, hentOppgavePåNytt, settFeilmelding }) => {
    const { saksbehandler } = useApp();

    const {
        gåTilBehandleSakOppgave,
        gåTilJournalføring,
        laster,
        //hentFagsakOgTriggRedirectTilBehandlingsoversikt,
        tildelOppgave,
        tilbakestillTildeling,
        //feilmelding,
    } = useOppgave(oppgave);

    const oppgaveTilordnetInnloggetSaksbehandler =
        oppgave.tilordnetRessurs === saksbehandler.navIdent;

    const gåTilOppgaveUtførelse = () => {
        if (oppgaveErSaksbehandling(oppgave)) {
            gåTilBehandleSakOppgave();
        } else if (oppgaveErJournalførKlage(oppgave)) {
            gåTilJournalføring('klage');
        } else if (oppgaveKanJournalføres(oppgave)) {
            gåTilJournalføring('stønad');
        } else {
            // eslint-disable-next-line no-console
            console.error(
                'Har ikke støtte for hentFagsakOgTriggRedirectTilBehandlingsoversikt ennå'
            );
            //hentFagsakOgTriggRedirectTilBehandlingsoversikt(utledetFolkeregisterIdent(oppgave));
        }
    };

    const utførHandlingOgHentOppgavePåNytt = (handling: () => Promise<void>) => () => {
        handling()
            .then(() => hentOppgavePåNytt())
            .catch((error: Error) => settFeilmelding(error.message));
    };

    const tildelOgGåTilOppgaveutførelse = () =>
        tildelOppgave()
            .then(gåTilOppgaveUtførelse)
            .catch((e) => settFeilmelding(e.message));

    if (oppgaveTilordnetInnloggetSaksbehandler) {
        return (
            <FlexContainer>
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
                            label: 'Fjern meg',
                            onClick: utførHandlingOgHentOppgavePåNytt(tilbakestillTildeling),
                        },
                    ]}
                />
            </FlexContainer>
        );
    } else if (oppgave.tilordnetRessurs) {
        return (
            <FlexContainer>
                {oppgave.tilordnetRessurs}
                <OppgaveValgMeny
                    valg={[
                        {
                            label: 'Overta',
                            onClick: utførHandlingOgHentOppgavePåNytt(tildelOppgave),
                        },
                    ]}
                />
            </FlexContainer>
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
                Tildel meg
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
