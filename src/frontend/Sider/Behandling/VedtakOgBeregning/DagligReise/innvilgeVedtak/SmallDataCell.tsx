import React, { FC, ReactNode } from 'react';

import { BodyShort, Table } from '@navikt/ds-react';

export const SmallDataCell: FC<{ children: ReactNode }> = ({ children }) => (
    <Table.DataCell>
        <BodyShort size="small">{children}</BodyShort>
    </Table.DataCell>
);
