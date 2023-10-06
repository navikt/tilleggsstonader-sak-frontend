import React from 'react';

import { Variabel } from './typer';

export const VariabelSerializer =
    (variabler: Record<string, string>): React.FC<{ value?: Variabel }> =>
    ({ value }) => {
        if (!value) {
            throw Error('Teknisk feil. Mangler variabel i block');
        }

        return <span>{variabler[value._id] || `[${value.visningsnavn}]`}</span>;
    };
