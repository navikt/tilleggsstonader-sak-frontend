import React, { FC } from 'react';

import { Heading, Label, Table } from '@navikt/ds-react';

import styles from './Beregningsresultat.module.css';
import { BillettType } from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import { BeregningsresultatDagligReise } from '../../../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoDato } from '../../../../../utils/dato';

interface Props {
    beregningsresultat: BeregningsresultatDagligReise;
}

function formaterAntallOgPris(antall: number | undefined, pris: number | undefined): string {
    if (!antall) {
        return '-';
    }
    return `${antall} x ${pris} kr`;
}

export const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => {
    return (
        <div>
            <Heading spacing size="small" level="4">
                Beregningsresultat
            </Heading>
            {beregningsresultat.offentligTransport?.reiser.map((reise, reiseIndex) => {
                const antallReisedagerPerUke = reise.perioder[0].antallReisedagerPerUke;
                return (
                    <div key={`reise-${reiseIndex}`} className={styles.reiseSection}>
                        <Label className={styles.reiseHeading}>
                            Offentlig transport {antallReisedagerPerUke} dager/uke
                        </Label>
                        <Table size="small" className={styles.table}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>F.o.m.</Table.HeaderCell>
                                    <Table.HeaderCell>T.o.m.</Table.HeaderCell>
                                    <Table.HeaderCell>Reisedager</Table.HeaderCell>
                                    <Table.HeaderCell>30-dagersb.</Table.HeaderCell>
                                    <Table.HeaderCell>7-dagersb.</Table.HeaderCell>
                                    <Table.HeaderCell>Enkeltb.</Table.HeaderCell>
                                    <Table.HeaderCell>Stønadsbeløp</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {reise.perioder
                                    .filter((periode) => !periode.fraTidligereVedtak)
                                    .map((periode, periodeIndex) => (
                                        <Table.Row key={`periode-${reiseIndex}-${periodeIndex}`}>
                                            <Table.DataCell>
                                                {formaterIsoDato(periode.fom)}
                                            </Table.DataCell>
                                            <Table.DataCell>
                                                {formaterIsoDato(periode.tom)}
                                            </Table.DataCell>
                                                <Table.DataCell>{periode.antallReisedager}</Table.DataCell>
                                            <Table.DataCell>
                                                {formaterAntallOgPris(
                                                    periode.billettdetaljer[
                                                        BillettType.TRETTIDAGERSBILLETT
                                                    ],
                                                    periode.pris30dagersbillett
                                                )}
                                            </Table.DataCell>
                                            <Table.DataCell>
                                                {formaterAntallOgPris(
                                                    periode.billettdetaljer[
                                                        BillettType.SYVDAGERSBILLETT
                                                    ],
                                                    periode.prisSyvdagersbillett
                                                )}
                                            </Table.DataCell>
                                            <Table.DataCell>
                                                {formaterAntallOgPris(
                                                    periode.billettdetaljer[
                                                        BillettType.ENKELTBILLETT
                                                    ],
                                                    periode.prisEnkeltbillett
                                                )}
                                            </Table.DataCell>
                                            <Table.DataCell>
                                                {periode.beløp} kr
                                            </Table.DataCell>
                                        </Table.Row>
                                    ))}
                            </Table.Body>
                        </Table>
                    </div>
                );
            })}
        </div>
    );
};
