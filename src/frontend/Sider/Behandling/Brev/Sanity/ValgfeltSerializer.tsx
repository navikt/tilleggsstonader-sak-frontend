import React from 'react';

import { PortableText } from '@portabletext/react';

import { FritekstSerializer } from './FritekstSerializer';
import { Fritekst, FritekstAvsnitt, Tekst, Valgfelt } from '../typer';
import { VariabelSerializer } from '../VariabelSerializer';

export const ValgfeltSerializer =
    (
        valgfelt: Partial<Record<string, Fritekst | Tekst>>,
        variabler: Record<string, string>,
        fritekst: Record<string, FritekstAvsnitt[] | undefined>
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
                    block: {
                        normal: ({ children }) => <div>{children}</div>,
                    },
                    marks: {
                        variabel: VariabelSerializer(variabler),
                    },
                }}
            />
        ) : (
            <FritekstSerializer avsnitt={fritekst[value._id]} />
        );
    };
