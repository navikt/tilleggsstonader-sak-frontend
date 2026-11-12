import React, { useState } from 'react';

import { Alert, Box, HGrid, Heading, HStack, Switch, Table, VStack } from '@navikt/ds-react';

import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../../komponenter/TabellSmall';
import {
    BeregningsgrunnlagFlyttebyrå,
    BeregningsgrunnlagFlytteSelv,
    BeregningsresultatFlytting,
    hentValgtFlyttebyråTilbud,
} from '../../../../../typer/vedtak/vedtakFlytting';
import { formaterIsoDato } from '../../../../../utils/dato';
import {
    formatBoolean,
    kronerMedTusenSkilleEllerStrek,
} from '../../../../../utils/tekstformatering';
import { ekstrakostnaderFlytting } from '../../../Stønadsvilkår/Flytting/typer/faktaFlytting';

const BeregningsResultatFlyttebyrå: React.FC<{
    beregningsresultat: BeregningsresultatFlytting;
}> = ({ beregningsresultat }) => {
    const flyttebyråResultater = beregningsresultat.resultater.filter(
        (resultat) => resultat.grunnlag.type === 'FLYTTEBYRÅ'
    );

    if (flyttebyråResultater.length === 0) {
        return null;
    }

    const visBeløpSomKanDekkes = flyttebyråResultater.some(
        (resultat) => !(resultat.grunnlag as BeregningsgrunnlagFlyttebyrå).erUtgiftNødvendig
    );

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
                            <TableHeaderCellSmall>Tilbud</TableHeaderCellSmall>
                            <TableHeaderCellSmall>Valgt flyttebyrå</TableHeaderCellSmall>
                            <TableHeaderCellSmall>Hele utgiften nødvendig?</TableHeaderCellSmall>
                            {visBeløpSomKanDekkes && (
                                <TableHeaderCellSmall>Beløp som kan dekkes</TableHeaderCellSmall>
                            )}
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
                                    <TableDataCellSmall style={{ overflowWrap: 'anywhere' }}>
                                        {grunnlag.tilbud.map((tilbud, index) => (
                                            <div key={`${index}-${tilbud.navn}`}>
                                                {`${tilbud.navn}: ${kronerMedTusenSkilleEllerStrek(tilbud.pris)}`}
                                            </div>
                                        ))}
                                    </TableDataCellSmall>
                                    <TableDataCellSmall style={{ overflowWrap: 'anywhere' }}>
                                        {hentValgtFlyttebyråTilbud(grunnlag).navn}
                                    </TableDataCellSmall>
                                    <TableDataCellSmall>
                                        {formatBoolean(grunnlag.erUtgiftNødvendig)}
                                    </TableDataCellSmall>
                                    {visBeløpSomKanDekkes && (
                                        <TableDataCellSmall>
                                            {grunnlag.erUtgiftNødvendig
                                                ? '-'
                                                : kronerMedTusenSkilleEllerStrek(
                                                      grunnlag.beløpSomKanDekkes ?? undefined
                                                  )}
                                        </TableDataCellSmall>
                                    )}
                                    <TableDataCellSmall>
                                        {formatBoolean(grunnlag.erUtgifterDokumentert)}
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
                Beregningsresultat for flytte selv
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
                            <TableHeaderCellSmall>Ekstrakostnader</TableHeaderCellSmall>
                            <TableHeaderCellSmall>Dokumentert og utbetales?</TableHeaderCellSmall>
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
                                    <TableDataCellSmall>
                                        {grunnlag.avstandEnVei} km
                                    </TableDataCellSmall>
                                    <TableDataCellSmall>
                                        {kronerMedTusenSkilleEllerStrek(grunnlag.sats)}
                                    </TableDataCellSmall>
                                    <TableDataCellSmall>
                                        {formatBoolean(grunnlag.satsBekreftet)}
                                    </TableDataCellSmall>
                                    <TableDataCellSmall>
                                        <HGrid columns={2} gap="space-24" align="start">
                                            {[
                                                ekstrakostnaderFlytting.slice(0, 3),
                                                ekstrakostnaderFlytting.slice(3),
                                            ].map((kostnader, index) => (
                                                <VStack key={index} gap="space-4">
                                                    {kostnader.map(({ felt, label }) => (
                                                        <HStack
                                                            key={felt}
                                                            justify="space-between"
                                                            wrap={false}
                                                            align="baseline"
                                                            gap={'space-0'}
                                                        >
                                                            <span>{label}</span>
                                                            <span style={{ whiteSpace: 'nowrap' }}>
                                                                {kronerMedTusenSkilleEllerStrek(
                                                                    grunnlag[felt]
                                                                )}
                                                            </span>
                                                        </HStack>
                                                    ))}
                                                </VStack>
                                            ))}
                                        </HGrid>
                                    </TableDataCellSmall>
                                    <TableDataCellSmall>
                                        {formatBoolean(grunnlag.erUtgifterDokumentert)}
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
