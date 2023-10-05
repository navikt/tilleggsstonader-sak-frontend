import React, { SetStateAction, useState } from 'react';

import { Select } from '@navikt/ds-react';

import Fritekst from './Fritekst';
import Tekst from './Tekst';
import { Valg, Valgfelt } from './typer';

interface Props {
    valgfelt: Valgfelt;
    settValgfelt: React.Dispatch<SetStateAction<Record<string, Valg>>>;
    variabler: Record<string, string>;
    settVariabler: React.Dispatch<SetStateAction<Record<string, string>>>;
}

const Valgfelt: React.FC<Props> = ({ valgfelt, settValgfelt, variabler, settVariabler }) => {
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
                    <Fritekst />
                ) : (
                    <Tekst tekst={valgtBlock} variabler={variabler} settVariabler={settVariabler} />
                ))}
        </>
    );
};

export default Valgfelt;
