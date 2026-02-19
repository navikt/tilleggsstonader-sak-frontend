import React, { FC } from 'react';

import { Table } from '@navikt/ds-react';

import { UkeRad } from './UkeRad';
import { ReisevurderingPrivatBil } from '../../../../typer/kjøreliste';

export const Reisevurdering: FC<{ kjøreliste: ReisevurderingPrivatBil | undefined }> = ({
    kjøreliste,
}) => {
    return (
        <Table size="small">
            <Table.Body>
                {kjøreliste?.uker.map((uke, index) => (
                    <UkeRad uke={uke} key={index} />
                ))}
            </Table.Body>
        </Table>
    );
};
