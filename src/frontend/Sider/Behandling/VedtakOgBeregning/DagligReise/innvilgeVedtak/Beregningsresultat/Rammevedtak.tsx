import React, { FC } from 'react';

import { CarIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, HStack, Table, VStack } from '@navikt/ds-react';

import styles from './Beregningsresultat.module.css';
import { Skillelinje } from '../../../../../../komponenter/Skillelinje';
import {
    TableDataCellSmall,
    TableHeaderCellSmall,
} from '../../../../../../komponenter/TabellSmall';
import { RammevedtakPrivatBil } from '../../../../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoDato } from '../../../../../../utils/dato';

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
            {rammevedtak.reiser.map((reise) => (
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
                                    <TableHeaderCellSmall>Reisedager per uke</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>Sats</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>Dagsats u/park</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>Bompenger per dag</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>
                                        Fergekostnader per dag
                                    </TableHeaderCellSmall>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {reise.delperioder.map((delperiode, index) => (
                                    <Table.Row key={index}>
                                        <TableDataCellSmall>
                                            {formaterIsoDato(delperiode.fom)} -{' '}
                                            {formaterIsoDato(delperiode.tom)}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {delperiode.reisedagerPerUke}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {delperiode.kilometersats}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {delperiode.dagsatsUtenParkering}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {delperiode.bompengerPerDag}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {delperiode.fergekostnadPerDag}
                                        </TableDataCellSmall>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </VStack>
                </VStack>
            ))}
        </>
    );
};
