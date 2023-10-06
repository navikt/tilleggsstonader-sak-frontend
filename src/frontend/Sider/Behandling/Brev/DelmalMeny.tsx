import React, { SetStateAction } from 'react';

import styled from 'styled-components';

import { Switch } from '@navikt/ds-react';

import Fritekst from './Fritekst';
import { Delmal as DelmalType, Valg } from './typer';
import Valgfelt from './Valgfelt';
import Variabler from './Variabler';

interface Props {
    delmal: DelmalType;
    valgfelt: Record<string, Valg>;
    settValgfelt: React.Dispatch<SetStateAction<Record<string, Valg>>>;
    variabler: Record<string, string>;
    settVariabler: React.Dispatch<SetStateAction<Record<string, string>>>;
}

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 640px;
`;

export const DelmalMeny: React.FC<Props> = ({ delmal, settValgfelt, variabler, settVariabler }) => {
    return (
        <FlexColumn>
            <Switch>Inkluder seksjon i brev</Switch>
            {delmal.blocks.map((val, index) => {
                switch (val._type) {
                    case 'valgfelt':
                        return (
                            <Valgfelt
                                valgfelt={val}
                                settValgfelt={settValgfelt}
                                variabler={variabler}
                                settVariabler={settVariabler}
                                key={index}
                            />
                        );
                    case 'block':
                        return (
                            <Variabler
                                variabler={val.markDefs}
                                variablerState={variabler}
                                settVariabler={settVariabler}
                                key={val._key}
                            />
                        );
                    case 'fritekst':
                        return <Fritekst key={index} />;
                }
            })}
        </FlexColumn>
    );
};
