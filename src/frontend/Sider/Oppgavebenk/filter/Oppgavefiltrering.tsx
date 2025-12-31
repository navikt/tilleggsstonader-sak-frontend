import React, { ChangeEvent } from 'react';

import { Button, Select, VStack } from '@navikt/ds-react';

import { oppdaterFilter } from './filterutils';
import { lagreTilLocalStorage, oppgaveRequestKey } from './oppgavefilterStorage';
import styles from './Oppgavefiltrering.module.css';
import SaksbehandlerVelger from './SaksbehandlerVelger';
import { useApp } from '../../../context/AppContext';
import { useOppgave } from '../../../context/OppgaveContext';
import {
    defaultOppgaveRequest,
    nullstillSortering,
    oppgaveRequestMedDefaultEnhet,
} from '../oppgaverequestUtil';
import { enhetTilTekst, hentEnheterSaksbehandlerHarTilgangTil } from '../typer/enhet';
import { behandlingstemaTilTekst, OppgaveBehandlingstype, OppgaveRequest } from '../typer/oppgave';
import {
    oppgaverTyperSomSkalVisesFørst,
    oppgaveTypeTilTekst,
    øvrigeOppgaveTyper,
} from '../typer/oppgavetema';

export const Oppgavefiltrering = () => {
    const { saksbehandler, appEnv } = useApp();
    const { oppgaveRequest, settOppgaveRequest, hentOppgaver } = useOppgave();

    const gyldigeEnheterForSaksbehandler = hentEnheterSaksbehandlerHarTilgangTil(
        appEnv,
        saksbehandler
    );

    const oppdaterOppgave = (key: keyof OppgaveRequest) => (val?: string | number | boolean) =>
        settOppgaveRequest((prevState) => oppdaterFilter(prevState, key, val));

    const oppdaterOppgaveTargetValue =
        (key: keyof OppgaveRequest) => (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
            oppdaterOppgave(key)(e.target.value);

    const sjekkFeilOgHentOppgaver = () => {
        const nullstiltSortering = nullstillSortering(oppgaveRequest);
        settOppgaveRequest(nullstiltSortering);
        lagreTilLocalStorage(oppgaveRequestKey(saksbehandler.navIdent), nullstiltSortering);
        hentOppgaver(nullstiltSortering);
    };

    const nullstillFiltrering = () => {
        const tomOppgaveRequest = oppgaveRequestMedDefaultEnhet(
            defaultOppgaveRequest,
            gyldigeEnheterForSaksbehandler
        );
        lagreTilLocalStorage(oppgaveRequestKey(saksbehandler.navIdent), tomOppgaveRequest);
        settOppgaveRequest(tomOppgaveRequest);
    };

    // Type brukes både for oppgavetype og behandlingstypen "klage"
    const håndterOppdaterType = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        if (e.target.value === OppgaveBehandlingstype.Klage) {
            oppdaterOppgave('oppgavetype')(undefined);
            oppdaterOppgaveTargetValue('behandlingstype')(e);
        } else {
            oppdaterOppgave('behandlingstype')(undefined);
            oppdaterOppgaveTargetValue('oppgavetype')(e);
        }
    };

    return (
        <VStack gap="4">
            <div className={styles.flexDiv}>
                <Select
                    value={oppgaveRequest.oppgaverPåVent ? 'På vent' : 'Klar'}
                    label="Benk"
                    onChange={(event) => {
                        nullstillFiltrering();
                        oppdaterOppgave('oppgaverPåVent')(event.target.value === 'På vent');
                    }}
                    size="small"
                >
                    <option value="Klar">Klar</option>
                    <option value="På vent">På vent</option>
                </Select>
                <Select
                    value={oppgaveRequest.oppgavetype || oppgaveRequest.behandlingstype || ''}
                    label="Type"
                    onChange={håndterOppdaterType}
                    size="small"
                >
                    <option value="">Alle</option>
                    {oppgaverTyperSomSkalVisesFørst.map((type) => (
                        <option key={type} value={type}>
                            {oppgaveTypeTilTekst[type]}
                        </option>
                    ))}
                    <option value={OppgaveBehandlingstype.Klage}>Klage</option>
                    <optgroup label={'Øvrige'}>
                        {øvrigeOppgaveTyper.map((type) => (
                            <option key={type} value={type}>
                                {oppgaveTypeTilTekst[type]}
                            </option>
                        ))}
                    </optgroup>
                </Select>
                <Select
                    value={oppgaveRequest.behandlingstema || ''}
                    label="Gjelder"
                    onChange={oppdaterOppgaveTargetValue('behandlingstema')}
                    size="small"
                >
                    <option value="">Alle</option>
                    {Object.entries(behandlingstemaTilTekst).map(([type, val]) => (
                        <option key={type} value={type}>
                            {val}
                        </option>
                    ))}
                </Select>
                <Select
                    value={oppgaveRequest.enhet}
                    label="Enhet"
                    onChange={oppdaterOppgaveTargetValue('enhet')}
                    size="small"
                >
                    {gyldigeEnheterForSaksbehandler.map((enhet) => (
                        <option key={enhet} value={enhet}>
                            {enhetTilTekst[enhet]}
                        </option>
                    ))}
                </Select>
                <SaksbehandlerVelger
                    oppgaveRequest={oppgaveRequest}
                    settOppgaveRequest={settOppgaveRequest}
                />
            </div>
            <div className={styles.knappWrapper}>
                <Button onClick={sjekkFeilOgHentOppgaver} type={'submit'} size="small">
                    Hent oppgaver
                </Button>
                <Button
                    variant={'secondary'}
                    onClick={nullstillFiltrering}
                    type={'button'}
                    size="small"
                >
                    Nullstill filtre
                </Button>
            </div>
        </VStack>
    );
};
