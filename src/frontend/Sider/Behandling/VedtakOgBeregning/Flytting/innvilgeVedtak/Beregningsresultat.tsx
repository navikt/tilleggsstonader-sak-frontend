import React, { useState } from 'react';

import { Alert, Box, Heading, HStack, Switch, Table, VStack } from '@navikt/ds-react';

import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../../komponenter/TabellSmall';
import {
    BeregningsgrunnlagFlyttebyrå,
    BeregningsgrunnlagFlytteSelv,
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

            <Box overflow="auto">
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <TableHeaderCellSmall>F.o.m.</TableHeaderCellSmall>
                            <TableHeaderCellSmall>T.o.m.</TableHeaderCellSmall>
                            <TableHeaderCellSmall>Tilbud 1</TableHeaderCellSmall>
                            <TableHeaderCellSmall>Tilbud 2</TableHeaderCellSmall>
                            <TableHeaderCellSmall>Dokumentert og utbetales?</TableHeaderCellSmall>
                            <TableHeaderCellSmall align="right">Stønadsbeløp</TableHeaderCellSmall>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {flyttebyråResultater.map((resultat) => {
                            const grunnlag = resultat.grunnlag as BeregningsgrunnlagFlyttebyrå;
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
                                    <TableDataCellSmall>
                                        {formatBoolean(grunnlag.erBetalingDokumentert)}
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
                            const grunnlag = resultat.grunnlag as BeregningsgrunnlagFlytteSelv;
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
    const [visTidligerePerioder, settVisTidligerePerioder] = useState(false);

    if (beregningsresultat.resultater.length === 0) {
        return <Alert variant="info">Ingen beregningsresultater for flytting.</Alert>;
    }

    const harPerioderFraTidligereVedtak = beregningsresultat.resultater.some(
        (resultat) => resultat.fraTidligereVedtak
    );
    const resultaterSomSkalVises = beregningsresultat.resultater.filter(
        (resultat) => visTidligerePerioder || !resultat.fraTidligereVedtak
    );

    return (
        <VStack gap="space-16">
            {harPerioderFraTidligereVedtak && (
                <HStack justify="end">
                    <Switch
                        position="left"
                        size="small"
                        checked={visTidligerePerioder}
                        onChange={() => settVisTidligerePerioder((prev) => !prev)}
                    >
                        Vis upåvirkede perioder
                    </Switch>
                </HStack>
            )}
            {resultaterSomSkalVises.length === 0 ? (
                <Alert variant="info">
                    Ingen ny beregning. Vis upåvirkede perioder for å se tidligere resultater.
                </Alert>
            ) : (
                <>
                    <BeregningsResultatFlyttebyrå
                        beregningsresultat={{ resultater: resultaterSomSkalVises }}
                    />
                    <BeregningsResultatFlytteSelv
                        beregningsresultat={{ resultater: resultaterSomSkalVises }}
                    />
                </>
            )}
        </VStack>
    );
};
