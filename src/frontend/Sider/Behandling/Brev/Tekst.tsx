import React, { SetStateAction } from 'react';

import { TextField } from '@navikt/ds-react';

import { Tekst } from './typer';

interface Props {
    tekst: Tekst;
    variabler: Record<string, string>;
    settVariabler: React.Dispatch<SetStateAction<Record<string, string>>>;
}

const Tekst: React.FC<Props> = ({ tekst, variabler, settVariabler }) => {
    return (
        <>
            {tekst.variabler.map((variabel) => {
                const håndterInput = (e: React.ChangeEvent<HTMLInputElement>) =>
                    settVariabler((prevState) => ({
                        ...prevState,
                        [variabel._id]: e.target.value,
                    }));

                return (
                    <div key={variabel._id}>
                        <TextField
                            label={variabel.visningsnavn}
                            key={variabel._id}
                            value={variabler[variabel._id] || ''}
                            onChange={håndterInput}
                        />
                    </div>
                );
            })}
        </>
    );
};

export default Tekst;
