import React, { ChangeEvent } from 'react';

import styled from 'styled-components';

import { Button, Select, VStack } from '@navikt/ds-react';

import { oppdaterFilter } from './filterutils';
import { lagreTilLocalStorage, oppgaveRequestKey } from './oppgavefilterStorage';
import SaksbehandlerVelger from './SaksbehandlerVelger';
import { useApp } from '../../../context/AppContext';
import { useOppgave } from '../../../context/OppgaveContext';
import { harEgenAnsattRolle, harStrengtFortroligRolle } from '../../../utils/roller';
import {
    defaultOppgaveRequest,
    nullstillSortering,
    oppgaveRequestMedDefaultEnhet,
} from '../oppgaverequestUtil';
import { enhetTilTekst } from '../typer/enhet';
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
            harSaksbehandlerStrengtFortroligRolle
        );
        lagreTilLocalStorage(oppgaveRequestKey(saksbehandler.navIdent), tomOppgaveRequest);
        settOppgaveRequest(tomOppgaveRequest);
    };

    return (
        <VStack gap="4">
            <FlexDiv>
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
