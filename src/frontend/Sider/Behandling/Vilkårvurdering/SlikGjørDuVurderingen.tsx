import * as React from 'react';

import { BodyLong, ReadMore } from '@navikt/ds-react';

import { hjelpetekster } from './tekster';

export const SlikGjørDuVurderingen: React.FC<{ regelId: string }> = ({ regelId }) => {
    return (
        <ReadMore header="Slik gjør du vurderingen" size="small">
            {hjelpetekster[regelId].map((avsnitt, indeks) => (
                <BodyLong spacing size="small" key={indeks}>
                    {avsnitt}
                </BodyLong>
            ))}
        </ReadMore>
    );
};
