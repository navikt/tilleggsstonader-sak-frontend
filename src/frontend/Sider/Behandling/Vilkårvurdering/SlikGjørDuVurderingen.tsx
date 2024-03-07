import * as React from 'react';

import { BodyLong, ReadMore } from '@navikt/ds-react';

import { spørsmålsforklaringer } from './tekster';

export const SlikGjørDuVurderingen: React.FC<{ regelId: string }> = ({ regelId }) => {
    return (
        <ReadMore header="Slik gjør du vurderingen">
            {spørsmålsforklaringer[regelId].map((avsnitt) => (
                <BodyLong spacing size="small">
                    {avsnitt}
                </BodyLong>
            ))}
        </ReadMore>
    );
};
