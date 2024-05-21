import React, { ChangeEvent } from 'react';

import styled from 'styled-components';

import { Button, Select, TextField, VStack } from '@navikt/ds-react';

import { oppdaterFilter } from './filterutils';
import { lagreTilLocalStorage, oppgaveRequestKey } from './oppgavefilterStorage';
import SaksbehandlerVelger from './SaksbehandlerVelger';
import { useApp } from '../../../context/AppContext';
import { useOppgave } from '../../../context/OppgaveContext';
import { harEgenAnsattRolle, harStrengtFortroligRolle } from '../../../utils/roller';
import { enhetTilTekst, FortroligEnhet, IkkeFortroligEnhet } from '../typer/enhet';
import { behandlingstemaTilTekst, OppgaveRequest } from '../typer/oppgave';
import {
    oppgaverTyperSomSkalVisesFørst,
    oppgaveTypeTilTekst,
    øvrigeOppgaveTyper,
} from '../typer/oppgavetema';

const FlexDiv = styled.div`
    display: flex;
    flex-wrap: wrap;
    column-gap: 1rem;
    row-gap: 1rem;
`;

const KnappWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
`;

export const Oppgavefiltrering = () => {
    const { saksbehandler, appEnv } = useApp();
    const { oppgaveRequest, settOppgaveRequest, hentOppgaver } = useOppgave();

    const harSaksbehandlerStrengtFortroligRolle = harStrengtFortroligRolle(appEnv, saksbehandler);
    const harSaksbehandlerEgenAnsattRolle = harEgenAnsattRolle(appEnv, saksbehandler);
    const tomOppgaveRequest = harSaksbehandlerStrengtFortroligRolle
        ? { enhet: FortroligEnhet.VIKAFOSSEN }
        : { enhet: IkkeFortroligEnhet.NAY };

    const oppdaterOppgave = (key: keyof OppgaveRequest) => (val?: string | number) =>
        settOppgaveRequest((prevState) => oppdaterFilter(prevState, key, val));

    const oppdaterOppgaveTargetValue =
        (key: keyof OppgaveRequest) => (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
            oppdaterOppgave(key)(e.target.value);

    const sjekkFeilOgHentOppgaver = () => {
        lagreTilLocalStorage(oppgaveRequestKey(saksbehandler.navIdent), oppgaveRequest);
        hentOppgaver(oppgaveRequest);
    };

    const nullstillFiltrering = () => {
        lagreTilLocalStorage(oppgaveRequestKey(saksbehandler.navIdent), tomOppgaveRequest);
        settOppgaveRequest(tomOppgaveRequest);
    };

    return (
        <VStack gap="4">
            <FlexDiv>
                <Select
                    value={oppgaveRequest.oppgavetype || ''}
                    label="Type"
                    onChange={oppdaterOppgaveTargetValue('oppgavetype')}
                    size="small"
                >
                    <option value="">Alle</option>
                    {oppgaverTyperSomSkalVisesFørst.map((type) => (
                        <option key={type} value={type}>
                            {oppgaveTypeTilTekst[type]}
                        </option>
                    ))}
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
                    size="small"
                />
            </FlexDiv>
            <KnappWrapper>
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
            </KnappWrapper>
        </VStack>
    );
};
