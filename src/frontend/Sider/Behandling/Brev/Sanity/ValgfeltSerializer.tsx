import React from 'react';

import { PortableText } from '@portabletext/react';

import { FritekstSerializer } from './FritekstSerializer';
import { Fritekst, Tekst, Valgfelt } from '../typer';

export const ValgfeltSerializer =
    (valgfelt: Record<string, Fritekst | Tekst>): React.FC<{ value: Valgfelt }> =>
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
                        variabel: (props) => <span>variabel med id: {props.value._id}</span>, // TODO: Bruke varibel fra state
                    },
                }}
            />
        ) : (
            <FritekstSerializer />
        );
    };
