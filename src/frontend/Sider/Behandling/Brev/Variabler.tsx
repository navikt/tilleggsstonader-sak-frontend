import React, { SetStateAction } from 'react';

import { TextField } from '@navikt/ds-react';

import { Variabel } from './typer';

interface Props {
    variabler: Variabel[];
    variablerState: Record<string, string>;
    settVariabler: React.Dispatch<SetStateAction<Record<string, string>>>;
}

const Variabler: React.FC<Props> = ({ variabler, variablerState, settVariabler }) => {
    return (
        <>
            {variabler.map((variabel) => {
                const håndterInput = (e: React.ChangeEvent<HTMLInputElement>) =>
                    settVariabler((prevState) => ({
                        ...prevState,
                        [variabel._id]: e.target.value,
                    }));

                if (!variabel.erHtml) {
                    return (
                        <div key={variabel._id}>
                            <TextField
                                label={variabel.visningsnavn}
                                key={variabel._id}
                                value={variablerState[variabel._id] || ''}
                                onChange={håndterInput}
                                autoComplete="off"
                            />
                        </div>
                    );
                }
            })}
        </>
    );
};

export default Variabler;
