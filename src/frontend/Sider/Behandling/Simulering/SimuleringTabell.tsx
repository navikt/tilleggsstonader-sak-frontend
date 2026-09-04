import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { HStack, Table } from '@navikt/ds-react';

import { BeløpFraAndreStønadstyperTooltip } from './BeløpFraAndreStønadstyperTooltip';
import { ResultatVerdi } from './ResultatVerdi';
import styles from './SimuleringTabell.module.css';
import { OppsummeringForPeriode } from './simuleringTyper';
import useSimuleringÅrvelger from './useSimuleringÅrvelger';
import ÅrVelger from './ÅrVelger';
import { formaterÅrMåned } from '../../../utils/dato';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../utils/fomatering';
import { storForbokstavFørsteOrd } from '../../../utils/tekstformatering';
import { Toggle } from '../../../utils/toggles';

interface Props {
    perioder: OppsummeringForPeriode[];
}
const SimuleringTabell: React.FC<Props> = ({ perioder }) => {
    const { perioderForValgtÅr, ...props } = useSimuleringÅrvelger(perioder);
    const visBeløpFraAndreStønadstyper = useFlag(
        Toggle.VIS_BELØP_FRA_ANDRE_STØNADSTYPER_I_SIMULERING
    );

    return (
        <Table size={'small'} className={styles.tabell}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                        <ÅrVelger {...props} />
                    </Table.HeaderCell>
                    {perioderForValgtÅr.map((p) => (
                        <Table.HeaderCell scope={'col'} key={p.måned} style={{ width: '7rem' }}>
                            {storForbokstavFørsteOrd(formaterÅrMåned(p.måned))}
                        </Table.HeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.HeaderCell>Nytt beløp</Table.HeaderCell>
                    {perioderForValgtÅr.map((p) => (
                        <Table.DataCell key={p.måned} scope={'row'} align={'right'}>
                            <HStack gap="space-4" align="center" justify="end">
                                {formaterTallMedTusenSkilleEllerStrek(p.nyUtbetaling)}
                                {visBeløpFraAndreStønadstyper && (
                                    <BeløpFraAndreStønadstyperTooltip
                                        beløpFraAndreStønadstyper={p.beløpFraAndreStønadstyper}
                                        beløpFraUkjentKilde={p.beløpFraUkjentKilde}
                                    />
                                )}
                            </HStack>
                        </Table.DataCell>
                    ))}
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell>Tidligere utbetalt</Table.HeaderCell>
                    {perioderForValgtÅr.map((p) => (
                        <Table.DataCell key={p.måned} align={'right'}>
                            {formaterTallMedTusenSkilleEllerStrek(p.tidligereUtbetalt)}
                        </Table.DataCell>
                    ))}
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell>Totalt etterbetaling</Table.HeaderCell>
                    {perioderForValgtÅr.map((p) => (
                        <Table.DataCell key={p.måned} align={'right'}>
                            <ResultatVerdi verdi={p.totalEtterbetaling}>
                                {formaterTallMedTusenSkilleEllerStrek(p.totalEtterbetaling)}
                            </ResultatVerdi>
                        </Table.DataCell>
                    ))}
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell>Totalt feilutbetaling</Table.HeaderCell>
                    {perioderForValgtÅr.map((p) => (
                        <Table.DataCell key={p.måned} align={'right'}>
                            <ResultatVerdi verdi={-p.totalFeilutbetaling}>
                                {formaterTallMedTusenSkilleEllerStrek(p.totalFeilutbetaling)}
                            </ResultatVerdi>
                        </Table.DataCell>
                    ))}
                </Table.Row>
            </Table.Body>
        </Table>
    );
};

export default SimuleringTabell;
