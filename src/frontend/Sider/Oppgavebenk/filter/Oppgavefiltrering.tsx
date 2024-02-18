import React, { ChangeEvent, useEffect, useState } from 'react';

import styled from 'styled-components';

import { Button, Select, TextField } from '@navikt/ds-react';

import { oppdaterFilter, oppgaveRequestMedDefaultEnhet } from './filterutils';
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
import { Behandlingstema, behandlingstemaTilTekst, OppgaveRequest } from '../typer/oppgave';
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
    const { hentOppgaver } = useOppgave();
    const [lasterFraLokalt, settLasterFraLokalt] = useState(true);
    const [oppgaveRequest, settOppgaveRequest] = useState<OppgaveRequest>({});

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

    const oppdaterOppgave = (key: keyof OppgaveRequest) => (val?: string | number) =>
        settOppgaveRequest((prevState) => oppdaterFilter(prevState, key, val));

    const oppdaterOppgaveTargetValue =
        (key: keyof OppgaveRequest) => (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
            oppdaterOppgave(key)(e.target.value);

    const sjekkFeilOgHentOppgaver = () => {
        lagreTilLocalStorage(oppgaveRequestKey(saksbehandler.navIdent), oppgaveRequest);
        hentOppgaver(oppgaveRequest);
    };

    const tilbakestillFiltrering = () => {
        lagreTilLocalStorage(oppgaveRequestKey(saksbehandler.navIdent), tomOppgaveRequest);
        settOppgaveRequest(tomOppgaveRequest);
        hentOppgaver(tomOppgaveRequest);
    };

    if (lasterFraLokalt) {
        return <SystemetLaster />;
    }

    return (
        <>
            <FlexDiv>
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
                    {Object.values(Behandlingstema).map((val) => (
                        <option key={val} value={val}>
                            {behandlingstemaTilTekst[val]}
                        </option>
                    ))}
                </Select>
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
