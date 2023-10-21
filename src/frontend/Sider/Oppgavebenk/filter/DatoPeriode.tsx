import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { datoFeil } from './filterutils';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import DateInput from '../../../komponenter/Skjema/DateInput';
import { StringOrUndefinedKeys } from '../../../typer/common';
import { OppgaveRequest } from '../typer/oppgave';

const FlexDiv = styled.div`
    display: flex;
    flex-wrap: wrap;
    column-gap: 1.5rem;
    row-gap: 1rem;
`;

interface Props {
    oppgaveRequest: OppgaveRequest;
    oppdaterOppgave: (key: keyof OppgaveRequest) => (val?: string | number) => void;
    fomKey: StringOrUndefinedKeys<OppgaveRequest>;
    tomKey: StringOrUndefinedKeys<OppgaveRequest>;
    fomLabel: string;
    tomLabel: string;
}

const DatoPeriode: React.FC<Props> = ({
    oppgaveRequest,
    oppdaterOppgave,
    fomKey,
    tomKey,
    fomLabel,
    tomLabel,
}) => {
    const [feil, settFeil] = useState<string>();

    const fomValue = oppgaveRequest[fomKey];
    const tomValue = oppgaveRequest[tomKey];
    useEffect(() => {
        const fristPeriodeFeil = datoFeil(fomValue, tomValue);
        settFeil(fristPeriodeFeil);
    }, [settFeil, fomValue, tomValue]);

    return (
        <FlexDiv>
            <DateInput
                label={fomLabel}
                value={fomValue}
                onChange={oppdaterOppgave(fomKey)}
                size="small"
            />
            <DateInput
                label={tomLabel}
                value={tomValue}
                onChange={oppdaterOppgave(tomKey)}
                size="small"
            />
            <Feilmelding>{feil}</Feilmelding>
        </FlexDiv>
    );
};

export default DatoPeriode;
