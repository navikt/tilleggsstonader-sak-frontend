import React, { ChangeEvent, useEffect, useState } from 'react';

import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { Button, Select, TextField } from '@navikt/ds-react';

import DatoPeriode from './DatoPeriode';
import { datoFeil, oppdaterFilter, oppgaveRequestMedDefaultEnhet } from './filterutils';
import MappeVelger from './MappeVelger';
import {
    hentFraLocalStorage,
    lagreTilLocalStorage,
    oppgaveRequestKey,
} from './oppgavefilterStorage';
import SaksbehandlerVelger from './SaksbehandlerVelger';
import { useApp } from '../../../context/AppContext';
import { useOppgave } from '../../../context/OppgaveContext';
import SystemetLaster from '../../../komponenter/SystemetLaster/SystemetLaster';
import { harEgenAnsattRolle, harStrengtFortroligRolle } from '../../../utils/roller';
import { Saksbehandler } from '../../../utils/saksbehandler';
import { enhetTilTekst, FortroligEnhet, IkkeFortroligEnhet } from '../typer/enhet';
import { behandlingstemaStønadstypeTilTekst, OppgaveRequest } from '../typer/oppgave';
import { oppgaveTypeTilTekst } from '../typer/oppgavetema';

const FlexDiv = styled.div`
    display: flex;
    flex-wrap: wrap;
    column-gap: 1.5rem;
    row-gap: 1rem;
`;

const KnappWrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
`;

const FiltreringKnapp = styled(Button)`
    margin-right: 1.5rem;
`;

interface Feil {
    opprettetPeriodeFeil?: string;
    fristPeriodeFeil?: string | null;
}

const hentLagretFiltrering = (
    saksbehandler: Saksbehandler,
    harSaksbehandlerStrengtFortroligRolle: boolean
): OppgaveRequest => {
    const fraLocalStorage = hentFraLocalStorage<OppgaveRequest>(
        oppgaveRequestKey(saksbehandler.navIdent),
        {}
    );

    return oppgaveRequestMedDefaultEnhet(fraLocalStorage, harSaksbehandlerStrengtFortroligRolle);
};

export const Oppgavefiltrering = () => {
    const { saksbehandler, appEnv } = useApp();
    const { hentOppgaver, mapper } = useOppgave();
    const [lasterFraLokalt, settLasterFraLokalt] = useState(true);
    // hack for force av rerender av datoer ved tilbakestilling
    const [stateId, settStateId] = useState(uuidv4());
    const [oppgaveRequest, settOppgaveRequest] = useState<OppgaveRequest>({});
    const [periodeFeil, settPerioderFeil] = useState<Feil>({});

    const harSaksbehandlerStrengtFortroligRolle = harStrengtFortroligRolle(appEnv, saksbehandler);
    const harSaksbehandlerEgenAnsattRolle = harEgenAnsattRolle(appEnv, saksbehandler);
    const tomOppgaveRequest = harSaksbehandlerStrengtFortroligRolle
        ? { enhet: FortroligEnhet.VIKAFOSSEN }
        : { enhet: IkkeFortroligEnhet.NAY };

    useEffect(() => {
        const lagretFiltrering = hentLagretFiltrering(
            saksbehandler,
            harSaksbehandlerStrengtFortroligRolle
        );
        settOppgaveRequest(lagretFiltrering);
        settLasterFraLokalt(false);
        hentOppgaver(lagretFiltrering);
    }, [hentOppgaver, harSaksbehandlerStrengtFortroligRolle, saksbehandler]);

    useEffect(() => {
        const fristPeriodeFeil = datoFeil(oppgaveRequest.fristFom, oppgaveRequest.fristTom);
        settPerioderFeil((prevState) => ({ ...prevState, fristPeriodeFeil }));
    }, [oppgaveRequest.fristTom, oppgaveRequest.fristFom]);

    useEffect(() => {
        const opprettetPeriodeFeil = datoFeil(
            oppgaveRequest.opprettetFom,
            oppgaveRequest.opprettetTom
        );
        settPerioderFeil((prevState) => ({ ...prevState, opprettetPeriodeFeil }));
    }, [oppgaveRequest.opprettetFom, oppgaveRequest.opprettetTom]);

    const oppdaterOppgave = (key: keyof OppgaveRequest) => (val?: string | number) =>
        settOppgaveRequest((prevState) => oppdaterFilter(prevState, key, val));

    const oppdaterOppgaveTargetValue =
        (key: keyof OppgaveRequest) => (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
            oppdaterOppgave(key)(e.target.value);

    const sjekkFeilOgHentOppgaver = () => {
        if (Object.values(periodeFeil).some((val?: string) => val)) {
            return;
        }
        lagreTilLocalStorage(oppgaveRequestKey(saksbehandler.navIdent), oppgaveRequest);
        hentOppgaver(oppgaveRequest);
    };

    const tilbakestillFiltrering = () => {
        lagreTilLocalStorage(oppgaveRequestKey(saksbehandler.navIdent), tomOppgaveRequest);
        settOppgaveRequest(tomOppgaveRequest);
        hentOppgaver(tomOppgaveRequest);
        settStateId(uuidv4());
    };

    if (lasterFraLokalt) {
        return <SystemetLaster />;
    }

    return (
        <>
            <FlexDiv key={stateId}>
                <DatoPeriode
                    oppgaveRequest={oppgaveRequest}
                    oppdaterOppgave={oppdaterOppgave}
                    fomKey={'opprettetFom'}
                    tomKey={'opprettetTom'}
                    fomLabel={'Reg.dato fra'}
                    tomLabel={'Reg.dato til'}
                />
                <Select
                    value={oppgaveRequest.oppgavetype}
                    label="Type"
                    onChange={oppdaterOppgaveTargetValue('oppgavetype')}
                >
                    <option value="">Alle</option>
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
                    <option value="">Alle</option>
                    {Object.entries(behandlingstemaStønadstypeTilTekst).map(([type, val]) => (
                        <option key={type} value={type}>
                            {val}
                        </option>
                    ))}
                </Select>
                <DatoPeriode
                    key={`opprettet_${stateId}`}
                    oppgaveRequest={oppgaveRequest}
                    oppdaterOppgave={oppdaterOppgave}
                    fomKey={'fristFom'}
                    tomKey={'fristTom'}
                    fomLabel={'Frist fra'}
                    tomLabel={'Frist til'}
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
                <MappeVelger
                    settOppgaveRequest={settOppgaveRequest}
                    label="Enhetsmappe"
                    options={mapper}
                    value={oppgaveRequest.mappeId}
                    erUtenMappe={oppgaveRequest.erUtenMappe}
                />
                <SaksbehandlerVelger
                    oppgaveRequest={oppgaveRequest}
                    settOppgaveRequest={settOppgaveRequest}
                />
                <TextField
                    value={oppgaveRequest.ident || ''}
                    label="Personident"
                    inputMode="numeric"
                    onChange={oppdaterOppgaveTargetValue('ident')}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sjekkFeilOgHentOppgaver();
                        }
                    }}
                    autoComplete="off"
                />
            </FlexDiv>
            <KnappWrapper>
                <FiltreringKnapp onClick={sjekkFeilOgHentOppgaver} type={'submit'}>
                    Hent oppgaver
                </FiltreringKnapp>
                <FiltreringKnapp
                    variant={'secondary'}
                    onClick={tilbakestillFiltrering}
                    type={'button'}
                >
                    Tilbakestill filtrering
                </FiltreringKnapp>
            </KnappWrapper>
        </>
    );
};
