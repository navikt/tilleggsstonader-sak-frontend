import React, { FC } from 'react';

import { Table } from '@navikt/ds-react';

import { UkeRad } from './UkeRad';
import { ReisevurderingPrivatBil, UkeVurdering } from '../../../../typer/kjøreliste';

export const Reisevurdering: FC<{
    reisevurdering: ReisevurderingPrivatBil;
    oppdaterUke: (uke: UkeVurdering) => void;
}> = ({ reisevurdering, oppdaterUke }) => {
    return (
        <Table size="small">
            <Table.Body>
                {reisevurdering?.uker.map((uke, index) => (
                    <UkeRad
                        uke={uke}
                        key={index}
                        oppdaterUke={oppdaterUke}
                        delperioder={reisevurdering.rammevedtak.delperioder}
                    />
                ))}
            </Table.Body>
        </Table>
    );
};
