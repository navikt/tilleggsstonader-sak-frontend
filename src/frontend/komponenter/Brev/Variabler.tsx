import React, { SetStateAction } from 'react';

import { TextField } from '@navikt/ds-react';

import { Variabel } from './typer';
import { useBehandling } from '../../context/BehandlingContext';

interface Props {
    variabler: Variabel[];
    variablerState: Partial<Record<string, string>>;
    settVariabler: React.Dispatch<SetStateAction<Partial<Record<string, string>>>>;
}

const Variabler: React.FC<Props> = ({ variabler, variablerState, settVariabler }) => {
    const behandlingContext = useBehandling();
    return (
        <>
            {variabler.map((variabel) => {
                const håndterInput = (e: React.ChangeEvent<HTMLInputElement>) =>
                    settVariabler((prevState) => ({
                        ...prevState,
                        [variabel._id]: e.target.value,
                    }));

                if (!variabel.erHtml) {
                    if (variabel.visningsnavn === 'Opphørsdato') {
                        return (
                            <div key={variabel._id}>
                                <TextField
                                    label={variabel.visningsnavn}
                                    key={variabel._id}
                                    value={
                                        variablerState[variabel._id] ||
                                        behandlingContext.behandling?.revurderFra ||
                                        ''
                                    }
                                    onChange={håndterInput}
                                    autoComplete="off"
                                    size="small"
                                />
                            </div>
                        );
                    }
                    return (
                        <div key={variabel._id}>
                            <TextField
                                label={variabel.visningsnavn}
                                key={variabel._id}
                                value={variablerState[variabel._id] || ''}
                                onChange={håndterInput}
                                autoComplete="off"
                                size="small"
                            />
                        </div>
                    );
                }
            })}
        </>
    );
};

export default Variabler;
