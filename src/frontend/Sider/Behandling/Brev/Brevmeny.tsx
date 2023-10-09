import React, { SetStateAction, useState } from 'react';

import Delmal from './Delmal';
import { FritekstAvsnitt, MalStruktur, Valg, Delmal as DelmalType, Valgfelt } from './typer';

interface Props {
    mal: MalStruktur;
}

const lagReducer =
    <T,>(
        id: string,
        state: Partial<Record<string, Record<string, T>>>,
        settState: React.Dispatch<SetStateAction<Partial<Record<string, Record<string, T>>>>>
    ) =>
    (utledNesteState: React.SetStateAction<Record<string, T>>) => {
        const prevState = state[id] || {};
        const nextState =
            typeof utledNesteState === 'function' ? utledNesteState(prevState) : utledNesteState;

        settState((prevState) => ({
            ...prevState,
            [id]: nextState,
        }));
    };

const Brevmeny: React.FC<Props> = ({ mal }) => {
    const [valgfelt, settValgfelt] = useState<
        Partial<Record<DelmalType['_id'], Record<Valgfelt['_id'], Valg>>>
    >({});
    const [variabler, settVariabler] = useState<
        Partial<Record<DelmalType['_id'], Record<string, string>>>
    >({});
    const [fritekst, settFritekst] = useState<
        Partial<Record<DelmalType['_id'], Record<string, FritekstAvsnitt[] | undefined>>>
    >({});

    return (
        <>
            {mal.delmaler.map((delmal) => (
                <Delmal
                    delmal={delmal}
                    key={delmal._id}
                    valgfelt={valgfelt[delmal._id] || {}}
                    settValgfelt={lagReducer(delmal._id, valgfelt, settValgfelt)}
                    variabler={variabler[delmal._id] || {}}
                    settVariabler={lagReducer(delmal._id, variabler, settVariabler)}
                    fritekst={fritekst[delmal._id] || {}}
                    settFritekst={lagReducer(delmal._id, fritekst, settFritekst)}
                />
            ))}
        </>
    );
};

export default Brevmeny;
