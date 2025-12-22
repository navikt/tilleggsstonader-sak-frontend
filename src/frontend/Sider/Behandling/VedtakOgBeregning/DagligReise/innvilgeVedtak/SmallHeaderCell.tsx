import React, { FC, ReactNode } from 'react';

import { BodyShort, Table } from '@navikt/ds-react';

export const SmallHeaderCell: FC<{ children: ReactNode }> = ({ children }) => (
    <Table.HeaderCell>
        <BodyShort weight="semibold" size="small">
            {children}
        </BodyShort>
    </Table.HeaderCell>
);
