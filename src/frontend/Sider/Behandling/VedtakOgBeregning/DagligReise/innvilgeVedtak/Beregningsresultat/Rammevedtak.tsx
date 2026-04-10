import React, { FC } from 'react';

import { CarIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, HStack, Table, VStack } from '@navikt/ds-react';

import styles from './Beregningsresultat.module.css';
import { Skillelinje } from '../../../../../../komponenter/Skillelinje';
import {
    TableDataCellSmall,
    TableHeaderCellSmall,
} from '../../../../../../komponenter/TabellSmall';
import {
    RammeForReiseMedPrivatBilDelperiode,
    RammeForReiseMedPrivatBilSatsForDelperiode,
    RammevedtakPrivatBil,
} from '../../../../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoDato } from '../../../../../../utils/dato';

// Hjelpefunksjon for å flate ut delperioder og satser til visningsrader
interface VisningsradPrivatBil {
    periode: { fom: string; tom: string };
    reisedagerPerUke: number;
    kilometersats: number;
    dagsatsUtenParkering: number;
    bompengerPerDag?: number;
    fergekostnadPerDag?: number;
}

function lagVisningsrader(
    delperioder: RammeForReiseMedPrivatBilDelperiode[]
): VisningsradPrivatBil[] {
    return delperioder.flatMap((delperiode: RammeForReiseMedPrivatBilDelperiode) =>
        delperiode.satser.map((sats: RammeForReiseMedPrivatBilSatsForDelperiode) => ({
            periode: {
                fom: sats.fom,
                tom: sats.tom,
            },
            reisedagerPerUke: delperiode.reisedagerPerUke,
            kilometersats: sats.kilometersats,
            dagsatsUtenParkering: sats.dagsatsUtenParkering,
            bompengerPerDag: delperiode.bompengerPerDag,
            fergekostnadPerDag: delperiode.fergekostnadPerDag,
        }))
    );
}

interface Props {
    rammevedtak: RammevedtakPrivatBil;
}

export const BeregningsresultatRammevedtakPrivatBil: FC<Props> = ({ rammevedtak }) => {
    return (
        <>
            <HStack align={'center'} gap="space-8">
                <Heading size="small" level="4">
                    Rammevedtak for reise med privat bil
                </Heading>
                <CarIcon fontSize={30} />
            </HStack>
            {rammevedtak.reiser.map((reise) => {
                const visningsrader = lagVisningsrader(reise.delperioder);
                return (
                    <VStack key={reise.reiseId} gap="space-8">
                        <Heading size="xsmall" level="5">
                            {reise.aktivitetsadresse} - rammevedtak
                        </Heading>
                        <VStack
                            style={{
                                border: 'solid 1px black',
                                borderRadius: '8px',
                            }}
                        >
                            <HStack
                                gap="space-32"
                                style={{ marginTop: '0.75rem', marginLeft: '0.75rem' }}
                            >
                                <VStack gap="space-2">
                                    <BodyShort size="small">
                                        <strong>Periode</strong>
                                    </BodyShort>
                                    <BodyShort size="small">
                                        {formaterIsoDato(reise.fom)} - {formaterIsoDato(reise.tom)}
                                    </BodyShort>
                                </VStack>
                                <VStack gap="space-2">
                                    <BodyShort size="small">
                                        <strong>Reiseavstand en vei</strong>
                                    </BodyShort>
                                    <BodyShort size="small">
                                        {rammevedtak.reiser[0].reiseavstandEnVei} km
                                    </BodyShort>
                                </VStack>
                            </HStack>
                            <Skillelinje data-color={'neutral'} />
                            <Table size="small" className={styles.table}>
                                <Table.Header>
                                    <Table.Row>
                                        <TableHeaderCellSmall>Delperiode</TableHeaderCellSmall>
                                        <TableHeaderCellSmall>
                                            Reisedager per uke
                                        </TableHeaderCellSmall>
                                        <TableHeaderCellSmall>Sats</TableHeaderCellSmall>
                                        <TableHeaderCellSmall>Dagsats u/park</TableHeaderCellSmall>
                                        <TableHeaderCellSmall>
                                            Bompenger per dag
                                        </TableHeaderCellSmall>
                                        <TableHeaderCellSmall>
                                            Fergekostnader per dag
                                        </TableHeaderCellSmall>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {visningsrader.map((rad, idx) => (
                                        <Table.Row key={idx}>
                                            <TableDataCellSmall>
                                                {formaterIsoDato(rad.periode.fom)} -{' '}
                                                {formaterIsoDato(rad.periode.tom)}
                                            </TableDataCellSmall>
                                            <TableDataCellSmall>
                                                {rad.reisedagerPerUke}
                                            </TableDataCellSmall>
                                            <TableDataCellSmall>
                                                {rad.kilometersats}
                                            </TableDataCellSmall>
                                            <TableDataCellSmall>
                                                {rad.dagsatsUtenParkering}
                                            </TableDataCellSmall>
                                            <TableDataCellSmall>
                                                {rad.bompengerPerDag}
                                            </TableDataCellSmall>
                                            <TableDataCellSmall>
                                                {rad.fergekostnadPerDag}
                                            </TableDataCellSmall>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </VStack>
                    </VStack>
                );
            })}
        </>
    );
};
