import React, { SetStateAction } from 'react';

import styled from 'styled-components';

import { Checkbox } from '@navikt/ds-react';

import Fritekst, { lagTomtAvsnitt } from './Fritekst';
import { Delmal as DelmalType, FritekstAvsnitt, Valg } from './typer';
import Valgfelt from './Valgfelt';
import { idEllerFritekst } from './valgUtil';
import Variabler from './Variabler';
import { useBrevFeilContext } from '../../context/BrevFeilContext';

interface Props {
    delmal: DelmalType;
    valgfelt: Partial<Record<string, Valg>>;
    settValgfelt: React.Dispatch<SetStateAction<Record<string, Valg>>>;
    variabler: Partial<Record<string, string>>;
    settVariabler: React.Dispatch<SetStateAction<Partial<Record<string, string>>>>;
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
    const { nullstillDelmal } = useBrevFeilContext();
    return (
        <FlexColumn>
            <Checkbox
                disabled={delmal.visningsdetaljer.skalAlltidMed}
                checked={inkluderIBrev}
                onChange={(e) => {
                    settInkluderIBrev(e.target.checked);
                    if (!e.target.checked) {
                        nullstillDelmal(delmal._id);
                    }
                }}
            >
                Inkluder seksjon i brev
            </Checkbox>
            {delmal.blocks.map((val, index) => {
                switch (val._type) {
                    case 'valgfelt':
                        return (
                            <Valgfelt
                                delmalId={delmal._id}
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
                                delmalId={delmal._id}
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
