import React from 'react';

import { TextField } from '@navikt/ds-react';

import { Tekst } from './typer';

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

export default Tekst;
