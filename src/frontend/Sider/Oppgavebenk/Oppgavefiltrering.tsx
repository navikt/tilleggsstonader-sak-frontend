import React, { ChangeEvent, useState } from 'react';

import styled from 'styled-components';

import { Select } from '@navikt/ds-react';

import { oppdaterFilter } from './oppgaveutil';
import { enhetTilTekst } from './typer/enhet';
import { behandlingstemaStønadstypeTilTekst, OppgaveRequest } from './typer/oppgave';
import { oppgaveTypeTilTekst } from './typer/oppgavetema';
import { useApp } from '../../context/AppContext';
import DateInput from '../../komponenter/Skjema/DateInput';
import { harEgenAnsattRolle, harStrengtFortroligRolle } from '../../utils/roller';

export const FlexDiv = styled.div`
    display: flex;
    flex-wrap: wrap;
    column-gap: 1.5rem;
    row-gap: 1rem;
`;

export const Oppgavefiltrering = () => {
    const [oppgaveRequest, settOppgaveRequest] = useState<OppgaveRequest>({});
    const { saksbehandler, appEnv } = useApp();
    const harSaksbehandlerStrengtFortroligRolle = harStrengtFortroligRolle(appEnv, saksbehandler);
    const harSaksbehandlerEgenAnsattRolle = harEgenAnsattRolle(appEnv, saksbehandler);
    const oppdaterOppgave = (key: keyof OppgaveRequest) => (val?: string | number) =>
        settOppgaveRequest((prevState) => oppdaterFilter(prevState, key, val));

    const oppdaterOppgaveTargetValue =
        (key: keyof OppgaveRequest) => (e: ChangeEvent<HTMLSelectElement>) =>
            oppdaterOppgave(key)(e.target.value);

    return (
        <FlexDiv>
            <DateInput
                label="Reg.dato fra"
                value={oppgaveRequest.opprettetFom}
                onChange={oppdaterOppgave('opprettetFom')}
                size="small"
            />
            <DateInput
                label="Reg.dato til"
                value={oppgaveRequest.opprettetTom}
                onChange={oppdaterOppgave('opprettetTom')}
                size="small"
            />
            <Select
                value={oppgaveRequest.oppgavetype}
                label="Type"
                onChange={oppdaterOppgaveTargetValue('oppgavetype')}
            >
                {Object.entries(oppgaveTypeTilTekst).map(([type, val]) => (
                    <option key={type} value={type}>
                        {val}
                    </option>
                ))}
            </Select>
            <Select
                value={oppgaveRequest.behandlingstema}
                label="Gjelder"
                onChange={oppdaterOppgaveTargetValue('behandlingstema')}
            >
                {Object.entries(behandlingstemaStønadstypeTilTekst).map(([type, val]) => (
                    <option key={type} value={type}>
                        {val}
                    </option>
                ))}
            </Select>
            <DateInput
                label="Frist fra"
                value={oppgaveRequest.fristFom}
                onChange={oppdaterOppgave('fristFom')}
                size="small"
            />
            <DateInput
                label="Frist til"
                value={oppgaveRequest.fristTom}
                onChange={oppdaterOppgave('fristTom')}
                size="small"
            />
            <Select
                value={oppgaveRequest.enhet}
                label="Enhet"
                onChange={oppdaterOppgaveTargetValue('enhet')}
            >
                {Object.entries(
                    enhetTilTekst(
                        harSaksbehandlerStrengtFortroligRolle,
                        harSaksbehandlerEgenAnsattRolle
                    )
                ).map(([type, val]) => (
                    <option key={type} value={type}>
                        {val}
                    </option>
                ))}
            </Select>
            {/*
            <MappeVelger
                onChange={(val) => {
                    if (val === 'uplassert') {
                        settOppgaveRequest((prevState: OppgaveRequest) => {
                            return { ...prevState, erUtenMappe: true, mappeId: undefined };
                        });
                    } else {
                        settOppgaveRequest((prevState: OppgaveRequest) => {
                            return { ...prevState, erUtenMappe: false, mappeId: parseInt(val) };
                        });
                    }
                }}
                label="Enhetsmappe"
                options={mapper}
                value={oppgaveRequest.mappeId}
                erUtenMappe={oppgaveRequest.erUtenMappe}
            />
            <Select
                value={saksbehandlerTekst}
                label="Saksbehandler"
                onChange={(event) => {
                    event.persist();
                    const val = event.target.value;
                    if (val === '') {
                        settOppgaveRequest((prevState: OppgaveRequest) => {
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            const { tildeltRessurs, tilordnetRessurs, ...rest } = prevState;
                            return rest;
                        });
                    } else if (val === 'Fordelte' || val === 'Ufordelte') {
                        settOppgaveRequest((prevState: OppgaveRequest) => {
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            const { tildeltRessurs, tilordnetRessurs, ...rest } = prevState;
                            return {
                                ...rest,
                                tildeltRessurs: val === 'Fordelte',
                            };
                        });
                    } else {
                        settOppgaveRequest((prevState: OppgaveRequest) => {
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            const { tildeltRessurs, tilordnetRessurs, ...rest } = prevState;
                            return {
                                ...rest,
                                tilordnetRessurs: val,
                            };
                        });
                    }
                }}
            >
                <option value="">Alle</option>
                <option value="Fordelte">Fordelte</option>
                <option value="Ufordelte">Ufordelte</option>
                {innloggetSaksbehandler && (
                    <option value={innloggetSaksbehandler.navIdent}>
                        {innloggetSaksbehandler.displayName}
                    </option>
                )}
            </Select>
            <TextField
                value={oppgaveRequest.ident || ''}
                label="Personident"
                inputMode="numeric"
                onChange={(e) => {
                    settOppgave('ident')(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        sjekkFeilOgHentOppgaver();
                    }
                }}
                autoComplete="off"
            />
            */}
        </FlexDiv>
    );
};
