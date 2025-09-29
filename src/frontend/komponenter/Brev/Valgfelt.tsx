import React, { SetStateAction } from 'react';

import { Select } from '@navikt/ds-react';

import Fritekst, { lagTomtAvsnitt } from './Fritekst';
import { FritekstAvsnitt, Valg, Valgfelt } from './typer';
import Variabler from './Variabler';
import { useBrevFeilContext } from '../../context/BrevFeilContext';

interface Props {
    delmalId: string;
    valgtVerdi: string | undefined;
    valgfelt: Valgfelt;
    settValgfelt: React.Dispatch<SetStateAction<Record<string, Valg>>>;
    variabler: Partial<Record<string, string>>;
    settVariabler: React.Dispatch<SetStateAction<Partial<Record<string, string>>>>;
    fritekst: Record<string, FritekstAvsnitt[] | undefined>;
    settFritekst: React.Dispatch<SetStateAction<Record<string, FritekstAvsnitt[] | undefined>>>;
}

const Valgfelt: React.FC<Props> = ({
    delmalId,
    valgtVerdi,
    valgfelt,
    settValgfelt,
    variabler,
    fritekst,
    settFritekst,
    settVariabler,
}) => {
    const { manglerVerdi, nullstillValgfelt, nullstillVariabel } = useBrevFeilContext();
    const finnValgtBlock = (id: string | undefined) =>
        valgfelt.valg.find(
            (valg) =>
                (valg._type === 'tekst' && valg._id === id) ||
                (valg._type === 'fritekst' && id === 'fritekst')
        );

    const valgtBlock = finnValgtBlock(valgtVerdi);

    const oppdaterValgfelt = (id: string) => {
        const nyttValgtBlock = finnValgtBlock(id);
        if (nyttValgtBlock) {
            nullstillValgfelt(delmalId, valgfelt._id);
        } else if (valgtBlock?._type === 'tekst') {
            valgtBlock.variabler.forEach((variabel) => nullstillVariabel(delmalId, variabel._id));
        }

        settValgfelt((prevState) => {
            const oppdatertState = { ...prevState };

            if (nyttValgtBlock) {
                oppdatertState[valgfelt._id] = nyttValgtBlock;
            } else {
                delete oppdatertState[valgfelt._id];
            }

            return oppdatertState;
        });
    };

    return (
        <>
            <Select
                label={valgfelt.visningsnavn}
                value={valgtVerdi || ''}
                onChange={(e) => oppdaterValgfelt(e.target.value)}
                size="small"
                error={manglerVerdi(delmalId, valgfelt._id) && 'Mangler verdi'}
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
                        alleAvsnitt={fritekst[valgfelt._id] || [lagTomtAvsnitt()]}
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
                        delmalId={delmalId}
                        variabler={valgtBlock.variabler}
                        variablerState={variabler}
                        settVariabler={settVariabler}
                    />
                ))}
        </>
    );
};

export default Valgfelt;
