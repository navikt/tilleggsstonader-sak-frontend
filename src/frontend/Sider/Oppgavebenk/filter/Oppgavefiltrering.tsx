import React, { ChangeEvent } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { Button, Select, Switch, VStack } from '@navikt/ds-react';

import { oppdaterFilter } from './filterutils';
import { lagreTilLocalStorage, oppgaveRequestKey } from './oppgavefilterStorage';
import styles from './Oppgavefiltrering.module.css';
import SaksbehandlerVelger from './SaksbehandlerVelger';
import { useApp } from '../../../context/AppContext';
import { useOppgave } from '../../../context/OppgaveContext';
import { Toggle } from '../../../utils/toggles';
import {
    defaultOppgaveRequest,
    nullstillSortering,
    oppgaveRequestMedDefaultEnhet,
} from '../oppgaverequestUtil';
import { Enheter, enhetTilTekst, hentEnheterSaksbehandlerHarTilgangTil } from '../typer/enhet';
import {
    Behandlingstema,
    behandlingstemaTilTekst,
    erAktivitetspengerBehandlingstype,
    erGyldigBehandlingstemaForEnhet,
    erKlageBehandlingstype,
    OppgaveBehandlingstype,
    OppgaveRequest,
} from '../typer/oppgave';
import {
    oppgaverTyperSomSkalVisesFørst,
    oppgaveTypeTilTekst,
    øvrigeOppgaveTyper,
} from '../typer/oppgavetema';

export const Oppgavefiltrering = () => {
    const { saksbehandler, appEnv } = useApp();
    const { oppgaveRequest, settOppgaveRequest, hentOppgaver } = useOppgave();
    const kanBehandleAktivitetspenger = useFlag(Toggle.KAN_BEHANDLE_AKTIVITETSPENGER);

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

    const oppdaterEnhet = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const oppdatertEnhet = e.target.value;
        oppdaterOppgave('enhet')(oppdatertEnhet);
        // Må nullstille gjelder-felt om det ikke er gyldig for ny enhet
        if (
            oppgaveRequest.behandlingstema &&
            !erGyldigBehandlingstemaForEnhet(
                oppgaveRequest.behandlingstema,
                oppdatertEnhet as Enheter
            )
        ) {
            oppdaterOppgave('behandlingstema')(undefined);
        }
    };
    const nullstillFiltrering = (påVent = oppgaveRequest.oppgaverPåVent) => {
        const tomOppgaveRequest = nullstillSortering({
            ...oppgaveRequestMedDefaultEnhet(defaultOppgaveRequest, gyldigeEnheterForSaksbehandler),
            oppgaverPåVent: påVent,
        });
        lagreTilLocalStorage(oppgaveRequestKey(saksbehandler.navIdent), tomOppgaveRequest);
        settOppgaveRequest(tomOppgaveRequest);
    };

    const kunAktivitetspenger = erAktivitetspengerBehandlingstype(oppgaveRequest.behandlingstype);
    const erKlageValgt = erKlageBehandlingstype(oppgaveRequest.behandlingstype);

    // Type brukes både for oppgavetype og behandlingstypen "klage"
    const håndterOppdaterType = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        if (e.target.value === OppgaveBehandlingstype.Klage) {
            oppdaterOppgave('oppgavetype')(undefined);
            oppdaterOppgave('behandlingstype')(
                kunAktivitetspenger
                    ? OppgaveBehandlingstype.AktivitetspengerKlage
                    : OppgaveBehandlingstype.Klage
            );
        } else {
            oppdaterOppgave('behandlingstype')(
                kunAktivitetspenger ? OppgaveBehandlingstype.Aktivitetspenger : undefined
            );
            oppdaterOppgaveTargetValue('oppgavetype')(e);
        }
    };

    // Oppgave-søket tar kun én behandlingstype, så aktivitetspenger kombineres med klage-valget
    const håndterKunAktivitetspenger = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            oppdaterOppgave('behandlingstype')(
                erKlageValgt
                    ? OppgaveBehandlingstype.AktivitetspengerKlage
                    : OppgaveBehandlingstype.Aktivitetspenger
            );
        } else {
            oppdaterOppgave('behandlingstype')(
                erKlageValgt ? OppgaveBehandlingstype.Klage : undefined
            );
        }
    };

    return (
        <VStack gap="space-16">
            <div className={styles.flexDiv}>
                <Select
                    value={oppgaveRequest.oppgaverPåVent ? 'På vent' : 'Klar'}
                    label="Benk"
                    onChange={(event) => nullstillFiltrering(event.target.value === 'På vent')}
                    size="small"
                >
                    <option value="Klar">Klar</option>
                    <option value="På vent">På vent</option>
                </Select>
                <Select
                    value={
                        oppgaveRequest.oppgavetype ||
                        (erKlageValgt ? OppgaveBehandlingstype.Klage : '')
                    }
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
                    {Object.entries(behandlingstemaTilTekst)
                        .filter(([type]) =>
                            erGyldigBehandlingstemaForEnhet(
                                type as Behandlingstema,
                                oppgaveRequest.enhet
                            )
                        )
                        .map(([type, val]) => (
                            <option key={type} value={type}>
                                {val}
                            </option>
                        ))}
                </Select>
                <Select
                    value={oppgaveRequest.enhet}
                    label="Enhet"
                    onChange={oppdaterEnhet}
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
            {kanBehandleAktivitetspenger && (
                <Switch
                    checked={kunAktivitetspenger}
                    onChange={håndterKunAktivitetspenger}
                    size="small"
                >
                    Vis kun aktivitetspenger
                </Switch>
            )}
            <div className={styles.knappWrapper}>
                <Button onClick={sjekkFeilOgHentOppgaver} type={'submit'} size="small">
                    Hent oppgaver
                </Button>
                <Button
                    variant={'secondary'}
                    onClick={() => nullstillFiltrering()}
                    type={'button'}
                    size="small"
                >
                    Nullstill filtre
                </Button>
            </div>
        </VStack>
    );
};
