import React from 'react';

import { DataCellProps, HeaderCellProps, Table } from '@navikt/ds-react';

export const TableDataCellSmall = (props: DataCellProps) => {
    return (
        <Table.DataCell textSize="small" {...props}>
            {props.children}
        </Table.DataCell>
    );
};

export const TableHeaderCellSmall = (props: HeaderCellProps) => {
    return (
        <Table.HeaderCell textSize="small" {...props}>
            {props.children}
        </Table.HeaderCell>
    );
};
