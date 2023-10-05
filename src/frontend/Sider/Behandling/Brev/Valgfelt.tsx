import React, { useState } from 'react';

import { Select, TextField } from '@navikt/ds-react';

import Fritekst from './Fritekst';
import { Tekst, Valgfelt } from './typer';

interface Props {
    valgfelt: Valgfelt;
}

const Tekst: React.FC<{ tekst: Tekst }> = ({ tekst }) => {
    return (
        <>
            {tekst.variabler.map((variabel) => (
                <div>
                    <TextField label={variabel.visningsnavn} key={variabel._id} />
                </div>
            ))}
        </>
    );
};

const Valgfelt: React.FC<Props> = ({ valgfelt }) => {
    const [valgt, settValgt] = useState<string>();

    const valgtBlock = valgfelt.valg.find(
        (valg) =>
            (valg._type === 'tekst' && valg._id === valgt) ||
            (valg._type === 'fritekst' && valgt === 'fritekst')
    );

    return (
        <>
            <Select
                label={valgfelt.visningsnavn}
                value={valgt || ''}
                onChange={(e) => settValgt(e.target.value)}
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
