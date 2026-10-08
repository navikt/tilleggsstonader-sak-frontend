import React from 'react';

import { Alert, BodyShort, Box, Heading, Table, VStack } from '@navikt/ds-react';

import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../../komponenter/TabellSmall';
import {
    BeregningsGrunnlagFlyttebyrå,
    BeregningsGrunnlagFlytteSelv,
    BeregningsresultatFlytting,
} from '../../../../../typer/vedtak/vedtakFlytting';
import { formaterIsoDato } from '../../../../../utils/dato';
import {
    formatBoolean,
    kronerMedTusenSkilleEllerStrek,
} from '../../../../../utils/tekstformatering';

const BeregningsResultatFlyttebyrå: React.FC<{
    beregningsresultat: BeregningsresultatFlytting;
}> = ({ beregningsresultat }) => {
    const flyttebyråResultater = beregningsresultat.resultater.filter(
        (resultat) => resultat.grunnlag.type === 'FLYTTEBYRÅ'
    );

    if (flyttebyråResultater.length === 0) {
        return null;
    }

    return (
        <div>
            <Heading spacing size="xsmall" level="4">
                Beregningsresultat for flyttebyrå
            </Heading>
            {flyttebyråResultater.some(
                (resultat) =>
                    resultat.grunnlag.type === 'FLYTTEBYRÅ' &&
                    resultat.grunnlag.erBetalingDokumentert
            ) && <BodyShort>Betaling for flyttebyrå er dokumentert</BodyShort>}
            <Box overflow="auto">
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <TableHeaderCellSmall>F.o.m.</TableHeaderCellSmall>
                            <TableHeaderCellSmall>T.o.m.</TableHeaderCellSmall>
                            <TableHeaderCellSmall>Tilbud 1</TableHeaderCellSmall>
                            <TableHeaderCellSmall>Tilbud 2</TableHeaderCellSmall>
                            <TableHeaderCellSmall align="right">Stønadsbeløp</TableHeaderCellSmall>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {flyttebyråResultater.map((resultat) => {
                            const grunnlag = resultat.grunnlag as BeregningsGrunnlagFlyttebyrå;
                            return (
                                <Table.Row key={`resultat-${resultat.fom}-${resultat.tom}`}>
                                    <TableDataCellSmall>
                                        {formaterIsoDato(resultat.fom)}
                                    </TableDataCellSmall>
                                    <TableDataCellSmall>
                                        {formaterIsoDato(resultat.tom)}
                                    </TableDataCellSmall>
                                    <TableDataCellSmall>
                                        {kronerMedTusenSkilleEllerStrek(grunnlag.tilbud1Pris)}
                                    </TableDataCellSmall>
                                    <TableDataCellSmall>
                                        {kronerMedTusenSkilleEllerStrek(grunnlag.tilbud2Pris)}
                                    </TableDataCellSmall>
                                    <TableDataCellSmall align="right">
                                        {kronerMedTusenSkilleEllerStrek(resultat.beløp)}
                                    </TableDataCellSmall>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            </Box>
        </div>
    );
};

const BeregningsResultatFlytteSelv: React.FC<{
    beregningsresultat: BeregningsresultatFlytting;
}> = ({ beregningsresultat }) => {
    const flytteSelvResultater = beregningsresultat.resultater.filter(
        (resultat) => resultat.grunnlag.type === 'FLYTTE_SELV'
    );

    if (flytteSelvResultater.length === 0) {
        return null;
    }

    return (
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
                            <TableHeaderCellSmall align="right">Stønadsbeløp</TableHeaderCellSmall>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {flytteSelvResultater.map((resultat) => {
                            const grunnlag = resultat.grunnlag as BeregningsGrunnlagFlytteSelv;
                            return (
                                <Table.Row key={`resultat-${resultat.fom}-${resultat.tom}`}>
                                    <TableDataCellSmall>
                                        {formaterIsoDato(resultat.fom)}
                                    </TableDataCellSmall>
                                    <TableDataCellSmall>
                                        {formaterIsoDato(resultat.tom)}
                                    </TableDataCellSmall>
                                    <TableDataCellSmall>{grunnlag.avstandEnVei}</TableDataCellSmall>
                                    <TableDataCellSmall>
                                        {kronerMedTusenSkilleEllerStrek(grunnlag.sats)}
                                    </TableDataCellSmall>
                                    <TableDataCellSmall>
                                        {formatBoolean(grunnlag.satsBekreftet)}
                                    </TableDataCellSmall>
                                    <TableDataCellSmall>
                                        {kronerMedTusenSkilleEllerStrek(grunnlag.henger)}
                                    </TableDataCellSmall>
                                    <TableDataCellSmall>
                                        {kronerMedTusenSkilleEllerStrek(grunnlag.bompenger)}
                                    </TableDataCellSmall>
                                    <TableDataCellSmall>
                                        {kronerMedTusenSkilleEllerStrek(grunnlag.ferge)}
                                    </TableDataCellSmall>
                                    <TableDataCellSmall>
                                        {kronerMedTusenSkilleEllerStrek(grunnlag.parkering)}
                                    </TableDataCellSmall>
                                    <TableDataCellSmall align="right">
                                        {kronerMedTusenSkilleEllerStrek(resultat.beløp)}
                                    </TableDataCellSmall>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            </Box>
        </div>
    );
};

export const Beregningsresultat: React.FC<{
    beregningsresultat: BeregningsresultatFlytting;
}> = ({ beregningsresultat }) => {
    if (beregningsresultat.resultater.length === 0) {
        return <Alert variant="info">Ingen beregningsresultater for flytting.</Alert>;
    }

    return (
        <VStack gap="space-16">
            <BeregningsResultatFlyttebyrå beregningsresultat={beregningsresultat} />
            <BeregningsResultatFlytteSelv beregningsresultat={beregningsresultat} />
        </VStack>
    );
};
