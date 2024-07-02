import React from 'react';

import styled from 'styled-components';

import { Box, Label, Table } from '@navikt/ds-react';

import { SimuleringOppsummering } from './simuleringTyper';
import { FlexColumn } from '../../../komponenter/Visningskomponenter/Flex';
import { formaterDato } from '../../../utils/dato';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../utils/fomatering';

const Tabell = styled(Table)`
    width: fit-content;
`;

const Oppsumering: React.FC<{ oppsumering: SimuleringOppsummering }> = ({ oppsumering }) => {
    return (
        <Box padding="4" background={'bg-subtle'}>
            <FlexColumn>
                <Label>
                    Totalt for periode {formaterDato(oppsumering.fom)} til og med{' '}
                    {formaterDato(oppsumering.tom)}
                </Label>
                <Tabell>
                    <Table.Body>
                        <Table.Row>
                            <Table.HeaderCell scope={'row'}>Etterbetaling</Table.HeaderCell>
                            <Table.DataCell align={'right'}>
                                {formaterTallMedTusenSkilleEllerStrek(oppsumering.etterbetaling)}
                            </Table.DataCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell scope={'row'}>Feilutbetaling</Table.HeaderCell>
                            <Table.DataCell align={'right'}>
                                {formaterTallMedTusenSkilleEllerStrek(oppsumering.feilutbetaling)}
                            </Table.DataCell>
                        </Table.Row>
                    </Table.Body>
                </Tabell>
            </FlexColumn>
        </Box>
    );
};
export default Oppsumering;
