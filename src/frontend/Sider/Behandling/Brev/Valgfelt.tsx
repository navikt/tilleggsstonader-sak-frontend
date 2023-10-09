import React, { SetStateAction, useState } from 'react';

import { Select } from '@navikt/ds-react';

import Fritekst, { lagTomtAvsnitt } from './Fritekst';
import { FritekstAvsnitt, Valg, Valgfelt } from './typer';
import Variabler from './Variabler';

interface Props {
    valgfelt: Valgfelt;
    settValgfelt: React.Dispatch<SetStateAction<Record<string, Valg>>>;
    variabler: Record<string, string>;
    settVariabler: React.Dispatch<SetStateAction<Record<string, string>>>;
    fritekst: Record<string, FritekstAvsnitt[] | undefined>;
    settFritekst: React.Dispatch<SetStateAction<Record<string, FritekstAvsnitt[] | undefined>>>;
}

const Valgfelt: React.FC<Props> = ({
    valgfelt,
    settValgfelt,
    variabler,
    fritekst,
    settFritekst,
    settVariabler,
}) => {
    const [valgt, settValgt] = useState<string>();

    const finnValgtBlock = (id: string | undefined) =>
        valgfelt.valg.find(
            (valg) =>
                (valg._type === 'tekst' && valg._id === id) ||
                (valg._type === 'fritekst' && id === 'fritekst')
        );

    const valgtBlock = finnValgtBlock(valgt);

    return (
        <>
            <Select
                label={valgfelt.visningsnavn}
                value={valgt || ''}
                onChange={(e) => {
                    settValgt(e.target.value);
                    settValgfelt((prevState) => {
                        const valgtBlock = finnValgtBlock(e.target.value);

                        return valgtBlock
                            ? { ...prevState, [valgfelt._id]: valgtBlock }
                            : prevState;
                    });
                }}
            >
                <option value={''}>Velg</option>
                {valgfelt.valg.map((valg, index) =>
                    valg._type == 'tekst' ? (
                        <option key={index} value={valg._id}>
                            {valg.visningsnavn}
                        </option>
                    ) : (
                        <option key={index} value={'fritekst'}>
                            Fritekst
                        </option>
                    )
                )}
            </Select>
            {valgtBlock &&
                (valgtBlock._type == 'fritekst' ? (
                    <Fritekst
                        avsnitt={fritekst[valgfelt._id] || [lagTomtAvsnitt()]}
                        settAvsnitt={(utledNextState) => {
                            const prevState = fritekst[valgfelt._id] || [lagTomtAvsnitt()];
                            const nextState =
                                typeof utledNextState === 'function'
                                    ? utledNextState(prevState)
                                    : utledNextState;

                            settFritekst((prevState) => ({
                                ...prevState,
                                [valgfelt._id]: nextState,
                            }));
                        }}
                    />
                ) : (
                    <Variabler
                        variabler={valgtBlock.variabler}
                        variablerState={variabler}
                        settVariabler={settVariabler}
                    />
                ))}
        </>
    );
};

export default Valgfelt;
