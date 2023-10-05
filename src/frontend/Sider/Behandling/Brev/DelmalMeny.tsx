import React, { SetStateAction } from 'react';

import styled from 'styled-components';

import { Switch } from '@navikt/ds-react';

import Fritekst from './Fritekst';
import {
    Delmal as DelmalType,
    Fritekst as FritekstType,
    Valg,
    Valgfelt as ValgfeltType,
} from './typer';
import Valgfelt from './Valgfelt';

interface Props {
    delmal: DelmalType;
    valgfelt: Record<string, Valg>;
    settValgfelt: React.Dispatch<SetStateAction<Record<string, Valg>>>;
}

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 640px;
`;

export const DelmalMeny: React.FC<Props> = ({ delmal, settValgfelt }) => {
    return (
        <FlexColumn>
            <Switch>Inkluder seksjon i brev</Switch>
            {delmal.blocks
                .filter(
                    (val): val is ValgfeltType | FritekstType =>
                        val._type === 'valgfelt' || val._type == 'fritekst'
                )
                .map((val, index) =>
                    val._type === 'valgfelt' ? (
                        <Valgfelt valgfelt={val} settValgfelt={settValgfelt} key={index} />
                    ) : (
                        <Fritekst key={index} />
                    )
                )}
        </FlexColumn>
    );
};
