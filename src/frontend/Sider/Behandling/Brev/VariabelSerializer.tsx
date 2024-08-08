/* eslint-disable react/prop-types */
import React from 'react';

import { Variabel } from './typer';

interface Props {
    value?: Variabel;
}

export const VariabelSerializer = (variabler: Partial<Record<string, string>>): React.FC<Props> =>
    function VariabelSerializer({ value }) {
        if (!value) {
            throw Error('Teknisk feil. Mangler variabel i block');
        }

        if (value.erHtml) {
            return (
                <div
                    dangerouslySetInnerHTML={{
                        __html: variabler[value._id] || 'Mangler html-variabel.',
                    }}
                ></div>
            );
        }

        return <span>{variabler[value._id] || `[${value.visningsnavn}]`}</span>;
    };
