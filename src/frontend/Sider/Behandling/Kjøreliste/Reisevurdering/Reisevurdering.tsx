import React, { FC } from 'react';

import { Table } from '@navikt/ds-react';

import { UkeRad } from './UkeRad';
import styles from './UkeRad.module.css';
import { TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
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
            <Table.Header>
                <TableHeaderCellSmall />
                <TableHeaderCellSmall className={styles.ukeKolonne}>Uke</TableHeaderCellSmall>
                <TableHeaderCellSmall className={styles.periodeKolonne}>
                    Periode
                </TableHeaderCellSmall>
                <TableHeaderCellSmall className={styles.vurderingKolonne}>
                    Vurderingsmåte
                </TableHeaderCellSmall>
                <TableHeaderCellSmall className={styles.statusKolonne} align="center">
                    Status
                </TableHeaderCellSmall>
                <TableHeaderCellSmall className={styles.utbetaltKolonne} align="center">
                    Utbetalt
                </TableHeaderCellSmall>
                <TableHeaderCellSmall className={styles.levertDatoKolonne}>
                    Levert dato
                </TableHeaderCellSmall>
            </Table.Header>
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
