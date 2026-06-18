import React, { FC } from 'react';

import { Table } from '@navikt/ds-react';

import { UkeRad } from './UkeRad';
import { ReisevurderingPrivatBil, UkeVurdering } from '../../../../typer/kjøreliste';
import { RammeForReiseMedPrivatBilDelperiode } from '../../../../typer/vedtak/vedtakDagligReise';

export const Reisevurdering: FC<{
    reisevurdering: ReisevurderingPrivatBil;
    oppdaterUke: (uke: UkeVurdering) => void;
}> = ({ reisevurdering, oppdaterUke }) => {
    const delperioderForUke = (uke: UkeVurdering): RammeForReiseMedPrivatBilDelperiode[] => {
        if (uke.erUkeSlettet && reisevurdering.forrigeRammevedtak) {
            return reisevurdering.forrigeRammevedtak.delperioder;
        }
        return reisevurdering.rammevedtak?.delperioder ?? [];
    };

    return (
        <Table size="small">
            <Table.Body>
                {reisevurdering?.uker.map((uke) => (
                    <UkeRad
                        uke={uke}
                        key={uke.ukenummer}
                        oppdaterUke={oppdaterUke}
                        delperioder={delperioderForUke(uke)}
                    />
                ))}
            </Table.Body>
        </Table>
    );
};
