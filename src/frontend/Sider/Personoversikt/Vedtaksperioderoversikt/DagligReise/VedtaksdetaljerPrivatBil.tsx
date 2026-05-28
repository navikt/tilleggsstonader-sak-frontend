import React, { FC } from 'react';

import { BodyShort, Table, VStack } from '@navikt/ds-react';

import styles from './VedtaksdetaljerPrivatBil.module.css';
import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import {
    RammeForReiseMedPrivatBil,
    RammeForReiseMedPrivatBilDelperiode,
} from '../../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoDato } from '../../../../utils/dato';
import { kronerEllerStrek } from '../../../../utils/tekstformatering';

type VisningsradPrivatBil = {
    fom: string;
    tom: string;
    reisedagerPerUke: number;
    kilometersats: number;
    dagsatsUtenParkering: number;
    bompengerPerDag: number | null;
    fergekostnadPerDag: number | null;
};

interface Props {
    rammevedtakPrivatBil: RammeForReiseMedPrivatBil;
    className?: string;
}

function lagVisningsrader(
    delperioder: RammeForReiseMedPrivatBilDelperiode[]
): VisningsradPrivatBil[] {
    return delperioder.flatMap((delperiode) =>
        delperiode.satser.map((sats) => ({
            fom: sats.fom,
            tom: sats.tom,
            reisedagerPerUke: delperiode.reisedagerPerUke,
            kilometersats: sats.kilometersats,
            dagsatsUtenParkering: sats.dagsatsUtenParkering,
            bompengerPerDag: delperiode.bompengerPerDag ?? null,
            fergekostnadPerDag: delperiode.fergekostnadPerDag ?? null,
        }))
    );
}

export const VedtaksdetaljerPrivatBil: FC<Props> = ({ rammevedtakPrivatBil, className }) => {
    const visningsrader = lagVisningsrader(rammevedtakPrivatBil.delperioder);

    return (
        <VStack gap="space-8" className={className}>
            <BodyShort size="small">
                <strong>Reiseavstand en vei:</strong> {rammevedtakPrivatBil.reiseavstandEnVei} km
            </BodyShort>

            <Table size="small" className={styles.table}>
                <Table.Header>
                    <Table.Row>
                        <TableHeaderCellSmall scope="col">Delperiode</TableHeaderCellSmall>
                        <TableHeaderCellSmall scope="col">Reisedager pr. uke</TableHeaderCellSmall>
                        <TableHeaderCellSmall scope="col">Kilometersats</TableHeaderCellSmall>
                        <TableHeaderCellSmall scope="col">Bompenger pr. dag</TableHeaderCellSmall>
                        <TableHeaderCellSmall scope="col">
                            Fergekostnad pr. dag
                        </TableHeaderCellSmall>
                        <TableHeaderCellSmall scope="col">
                            Dagsats uten parkering
                        </TableHeaderCellSmall>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {visningsrader.length === 0 ? (
                        <Table.Row>
                            <Table.DataCell colSpan={6}>Ingen delperioder</Table.DataCell>
                        </Table.Row>
                    ) : (
                        visningsrader.map((rad, index) => (
                            <Table.Row key={`${rad.fom}-${rad.tom}-${index}`}>
                                <TableDataCellSmall>
                                    {formaterIsoDato(rad.fom)} - {formaterIsoDato(rad.tom)}
                                </TableDataCellSmall>
                                <TableDataCellSmall>{rad.reisedagerPerUke}</TableDataCellSmall>
                                <TableDataCellSmall>{rad.kilometersats} kr</TableDataCellSmall>
                                <TableDataCellSmall>
                                    {kronerEllerStrek(rad.bompengerPerDag ?? undefined)}
                                </TableDataCellSmall>
                                <TableDataCellSmall>
                                    {kronerEllerStrek(rad.fergekostnadPerDag ?? undefined)}
                                </TableDataCellSmall>
                                <TableDataCellSmall>
                                    {rad.dagsatsUtenParkering} kr
                                </TableDataCellSmall>
                            </Table.Row>
                        ))
                    )}
                </Table.Body>
            </Table>
        </VStack>
    );
};
