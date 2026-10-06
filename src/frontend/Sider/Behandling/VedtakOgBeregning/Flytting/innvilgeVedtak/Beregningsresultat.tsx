import React from 'react';

import { Alert, Box, Heading, Table, VStack } from '@navikt/ds-react';

import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../../komponenter/TabellSmall';
import { BeregningsresultatFlytting } from '../../../../../typer/vedtak/vedtakFlytting';
import { formaterIsoDato } from '../../../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../../../utils/fomatering';
import {
    formatBoolean,
    kronerMedTusenSkilleEllerStrek,
} from '../../../../../utils/tekstformatering';

export const Beregningsresultat: React.FC<{
    beregningsresultat: BeregningsresultatFlytting;
}> = ({ beregningsresultat }) => {
    const flyttebyrå = beregningsresultat.resultater.filter(
        (resultat) => resultat.flyttemåte === 'FLYTTEBYRÅ'
    );
    const egenKjøring = beregningsresultat.resultater.filter(
        (resultat) => resultat.flyttemåte === 'EGEN_KJØRING'
    );

    if (beregningsresultat.resultater.length === 0) {
        return <Alert variant="info">Ingen beregningsresultater for flytting.</Alert>;
    }

    return (
        <VStack gap="space-16">
            {flyttebyrå.length > 0 && (
                <div>
                    <Heading spacing size="xsmall" level="4">
                        Beregningsresultat for flyttebyrå
                    </Heading>
                    <Box overflow="auto">
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <TableHeaderCellSmall>F.o.m.</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>T.o.m.</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>Tilbud 1</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>Tilbud 2</TableHeaderCellSmall>
                                    <TableHeaderCellSmall align="right">
                                        Stønadsbeløp
                                    </TableHeaderCellSmall>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {flyttebyrå.map((resultat) => (
                                    <Table.Row key={resultat.vilkårId}>
                                        <TableDataCellSmall>
                                            {formaterIsoDato(resultat.fom)}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {formaterIsoDato(resultat.tom)}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {kronerMedTusenSkilleEllerStrek(
                                                resultat.grunnlag.tilbud1Pris
                                            )}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {kronerMedTusenSkilleEllerStrek(
                                                resultat.grunnlag.tilbud2Pris
                                            )}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall align="right">
                                            {kronerMedTusenSkilleEllerStrek(resultat.beløp)}
                                        </TableDataCellSmall>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </Box>
                </div>
            )}
            {egenKjøring.length > 0 && (
                <div>
                    <Heading spacing size="xsmall" level="4">
                        Beregningsresultat for egen kjøring
                    </Heading>
                    <Box overflow="auto">
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <TableHeaderCellSmall>F.o.m.</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>T.o.m.</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>Avstand én vei</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>Sats per km</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>Sats bekreftet</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>Henger</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>Bompenger</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>Ferge</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>Parkering</TableHeaderCellSmall>
                                    <TableHeaderCellSmall align="right">
                                        Stønadsbeløp
                                    </TableHeaderCellSmall>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {egenKjøring.map((resultat) => (
                                    <Table.Row key={resultat.vilkårId}>
                                        <TableDataCellSmall>
                                            {formaterIsoDato(resultat.fom)}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {formaterIsoDato(resultat.tom)}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {formaterTallMedTusenSkille(
                                                resultat.grunnlag.avstandEnVei
                                            )}{' '}
                                            km
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {kronerMedTusenSkilleEllerStrek(resultat.grunnlag.sats)}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {formatBoolean(resultat.grunnlag.satsBekreftet)}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {kronerMedTusenSkilleEllerStrek(
                                                resultat.grunnlag.henger
                                            )}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {kronerMedTusenSkilleEllerStrek(
                                                resultat.grunnlag.bompenger
                                            )}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {kronerMedTusenSkilleEllerStrek(
                                                resultat.grunnlag.ferge
                                            )}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {kronerMedTusenSkilleEllerStrek(
                                                resultat.grunnlag.parkering
                                            )}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall align="right">
                                            {kronerMedTusenSkilleEllerStrek(resultat.beløp)}
                                        </TableDataCellSmall>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </Box>
                </div>
            )}
        </VStack>
    );
};
