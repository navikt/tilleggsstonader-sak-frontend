import React from 'react';

import styled from 'styled-components';

import { Table } from '@navikt/ds-react';

import { ResultatVerdi } from './ResultatVerdi';
import { OppsummeringForPeriode } from './simuleringTyper';
import useSimuleringÅrvelger from './useSimuleringÅrvelger';
import ÅrVelger from './ÅrVelger';
import { formaterÅrMåned } from '../../../utils/dato';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../utils/fomatering';
import { toTitleCase } from '../../../utils/tekstformatering';

const Tabell = styled(Table)`
    margin-top: 1rem;
`;

interface Props {
    perioder: OppsummeringForPeriode[];
}
const SimuleringTabell: React.FC<Props> = ({ perioder }) => {
    const { perioderForValgtÅr, ...props } = useSimuleringÅrvelger(perioder);

    return (
        <Tabell size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                        <ÅrVelger {...props} />
                    </Table.HeaderCell>
                    {perioderForValgtÅr.map((p) => (
                        <Table.HeaderCell scope={'col'} key={p.fom} style={{ width: '6rem' }}>
                            {toTitleCase(formaterÅrMåned(p.fom))}
                        </Table.HeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.HeaderCell>Nytt beløp</Table.HeaderCell>
                    {perioderForValgtÅr.map((p) => (
                        <Table.DataCell key={p.fom} scope={'row'} align={'right'}>
                            {formaterTallMedTusenSkilleEllerStrek(p.nyUtbetaling)}
                        </Table.DataCell>
                    ))}
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell>Tidligere utbetalt</Table.HeaderCell>
                    {perioderForValgtÅr.map((p) => (
                        <Table.DataCell key={p.fom} align={'right'}>
                            {formaterTallMedTusenSkilleEllerStrek(p.tidligereUtbetalt)}
                        </Table.DataCell>
                    ))}
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell>Totalt etterbetaling</Table.HeaderCell>
                    {perioderForValgtÅr.map((p) => (
                        <Table.DataCell key={p.fom} align={'right'}>
                            <ResultatVerdi $verdi={p.totalEtterbetaling}>
                                {formaterTallMedTusenSkilleEllerStrek(p.totalEtterbetaling)}
                            </ResultatVerdi>
                        </Table.DataCell>
                    ))}
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell>Totalt feilutbetaling</Table.HeaderCell>
                    {perioderForValgtÅr.map((p) => (
                        <Table.DataCell key={p.fom} align={'right'}>
                            <ResultatVerdi $verdi={-p.totalFeilutbetaling}>
                                {formaterTallMedTusenSkilleEllerStrek(p.totalFeilutbetaling)}
                            </ResultatVerdi>
                        </Table.DataCell>
                    ))}
                </Table.Row>
            </Table.Body>
        </Tabell>
    );
};

export default SimuleringTabell;
