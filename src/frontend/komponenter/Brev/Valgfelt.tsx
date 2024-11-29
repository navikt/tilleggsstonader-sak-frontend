import React, { SetStateAction } from 'react';

import { Select } from '@navikt/ds-react';

import Fritekst, { lagTomtAvsnitt } from './Fritekst';
import { FritekstAvsnitt, Valg, Valgfelt } from './typer';
import Variabler from './Variabler';

interface Props {
    valgtVerdi: string | undefined;
    valgfelt: Valgfelt;
    settValgfelt: React.Dispatch<SetStateAction<Record<string, Valg>>>;
    variabler: Partial<Record<string, string>>;
    settVariabler: React.Dispatch<SetStateAction<Partial<Record<string, string>>>>;
    fritekst: Record<string, FritekstAvsnitt[] | undefined>;
    settFritekst: React.Dispatch<SetStateAction<Record<string, FritekstAvsnitt[] | undefined>>>;
}

const Valgfelt: React.FC<Props> = ({
    valgtVerdi,
    valgfelt,
    settValgfelt,
    variabler,
    fritekst,
    settFritekst,
    settVariabler,
}) => {
    const finnValgtBlock = (id: string | undefined) =>
        valgfelt.valg.find(
            (valg) =>
                (valg._type === 'tekst' && valg._id === id) ||
                (valg._type === 'fritekst' && id === 'fritekst')
        );

    const oppdaterValgfelt = (id: string) => {
        const valgtBlock = finnValgtBlock(id);

        settValgfelt((prevState) => {
            const oppdatertState = { ...prevState };

            if (valgtBlock) {
                oppdatertState[valgfelt._id] = valgtBlock;
            } else {
                delete oppdatertState[valgfelt._id];
            }

            return oppdatertState;
        });
    };

    const valgtBlock = finnValgtBlock(valgtVerdi);

    return (
        <>
            <Select
                label={valgfelt.visningsnavn}
                value={valgtVerdi || ''}
                onChange={(e) => oppdaterValgfelt(e.target.value)}
                size="small"
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
