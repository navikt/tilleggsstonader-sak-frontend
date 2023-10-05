import React from 'react';

import { PortableText } from '@portabletext/react';

import { FritekstSerializer } from './FritekstSerializer';
import { Fritekst, Tekst, Valgfelt } from '../typer';

export const ValgfeltSerializer =
    (
        valgfelt: Record<string, Fritekst | Tekst>,
        variabler: Record<string, string>
    ): React.FC<{ value: Valgfelt }> =>
    ({ value }) => {
        const valg = valgfelt[value._id];

        if (!valg) {
            return null;
        }

        return valg._type === 'tekst' ? (
            <PortableText
                value={valg.innhold}
                components={{
                    marks: {
                        variabel: (props) => (
                            <span>
                                {variabler[props.value._id] || `[${props.value.visningsnavn}]`}
                            </span>
                        ),
                    },
                }}
            />
        ) : (
            <FritekstSerializer />
        );
    };
