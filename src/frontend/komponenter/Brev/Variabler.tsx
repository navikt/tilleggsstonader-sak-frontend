import React, { SetStateAction } from 'react';

import { TextField } from '@navikt/ds-react';

import { Variabel } from './typer';
import { useBrevFeilContext } from '../../context/BrevFeilContext';

interface Props {
    delmalId: string;
    variabler: Variabel[];
    variablerState: Partial<Record<string, string>>;
    settVariabler: React.Dispatch<SetStateAction<Partial<Record<string, string>>>>;
}

const Variabler: React.FC<Props> = ({ delmalId, variabler, variablerState, settVariabler }) => {
    const { manglerVerdi, nullstillVariabel } = useBrevFeilContext();

    return (
        <>
            {variabler.map((variabel) => {
                const håndterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
                    settVariabler((prevState) => ({
                        ...prevState,
                        [variabel._id]: e.target.value,
                    }));
                    nullstillVariabel(delmalId, variabel._id);
                };

                if (!variabel.erHtml) {
                    return (
                        <div key={variabel._id}>
                            <TextField
                                label={variabel.visningsnavn}
                                key={variabel._id}
                                value={variablerState[variabel._id] || ''}
                                onChange={håndterInput}
                                autoComplete="off"
                                size="small"
                                error={manglerVerdi(delmalId, variabel._id) && 'Mangler verdi'}
                            />
                        </div>
                    );
                }
            })}
        </>
    );
};

export default Variabler;
