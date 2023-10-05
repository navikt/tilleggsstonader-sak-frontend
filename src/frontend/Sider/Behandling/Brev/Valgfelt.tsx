import React, { SetStateAction, useState } from 'react';

import { Select, TextField } from '@navikt/ds-react';

import Fritekst from './Fritekst';
import { Tekst, Valg, Valgfelt } from './typer';

interface Props {
    valgfelt: Valgfelt;
    settValgfelt: React.Dispatch<SetStateAction<Record<string, Valg>>>;
}

const Tekst: React.FC<{ tekst: Tekst }> = ({ tekst }) => {
    return (
        <>
            {tekst.variabler.map((variabel) => (
                <div key={variabel._id}>
                    <TextField label={variabel.visningsnavn} key={variabel._id} />
                </div>
            ))}
        </>
    );
};

const Valgfelt: React.FC<Props> = ({ valgfelt, settValgfelt }) => {
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
                (valgtBlock._type == 'fritekst' ? <Fritekst /> : <Tekst tekst={valgtBlock} />)}
        </>
    );
};

export default Valgfelt;
