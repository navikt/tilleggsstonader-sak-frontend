import React, { SetStateAction } from 'react';

import styled from 'styled-components';

import { Switch } from '@navikt/ds-react';

import { idEllerFritekst } from './brevUtils';
import Fritekst, { lagTomtAvsnitt } from './Fritekst';
import { Delmal as DelmalType, FritekstAvsnitt, Valg } from './typer';
import Valgfelt from './Valgfelt';
import Variabler from './Variabler';

interface Props {
    delmal: DelmalType;
    valgfelt: Record<string, Valg>;
    settValgfelt: React.Dispatch<SetStateAction<Record<string, Valg>>>;
    variabler: Record<string, string>;
    settVariabler: React.Dispatch<SetStateAction<Record<string, string>>>;
    fritekst: Record<string, FritekstAvsnitt[] | undefined>;
    settFritekst: React.Dispatch<SetStateAction<Record<string, FritekstAvsnitt[] | undefined>>>;
    inkluderIBrev: boolean;
    settInkluderIBrev: (inkluderIBrev: boolean) => void;
}

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const DelmalMeny: React.FC<Props> = ({
    delmal,
    valgfelt,
    settValgfelt,
    variabler,
    settVariabler,
    fritekst,
    settFritekst,
    inkluderIBrev,
    settInkluderIBrev,
}) => {
    return (
        <FlexColumn>
            <Switch
                disabled={delmal.visningsdetaljer.skalAlltidMed}
                checked={inkluderIBrev}
                onChange={(e) => settInkluderIBrev(e.target.checked)}
            >
                Inkluder seksjon i brev
            </Switch>
            {delmal.blocks.map((val, index) => {
                switch (val._type) {
                    case 'valgfelt':
                        return (
                            <Valgfelt
                                valgtVerdi={idEllerFritekst(valgfelt[val._id])}
                                valgfelt={val}
                                settValgfelt={settValgfelt}
                                variabler={variabler}
                                settVariabler={settVariabler}
                                fritekst={fritekst}
                                settFritekst={settFritekst}
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
                        return (
                            <Fritekst
                                key={index}
                                avsnitt={fritekst[delmal._id] || [lagTomtAvsnitt()]}
                                settAvsnitt={(utledNextState) => {
                                    const prevState = fritekst[delmal._id] || [lagTomtAvsnitt()];
                                    const nextState =
                                        typeof utledNextState === 'function'
                                            ? utledNextState(prevState)
                                            : utledNextState;

                                    settFritekst((prevState) => ({
                                        ...prevState,
                                        [delmal._id]: nextState,
                                    }));
                                }}
                            />
                        );
                }
            })}
        </FlexColumn>
    );
};
