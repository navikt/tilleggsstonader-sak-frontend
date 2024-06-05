import React from 'react';

import { styled } from 'styled-components';

import { Alert, Detail, Table, VStack } from '@navikt/ds-react';
import { ABorderDivider } from '@navikt/ds-tokens/dist/tokens';

import ExpansionCard from '../../../../komponenter/ExpansionCard';
import { registerYtelseTilTekst } from '../../../../typer/registerytelser';
import { formaterNullableIsoDato, formaterNullableIsoDatoTid } from '../../../../utils/dato';
import { VilkårperioderGrunnlag } from '../typer/vilkårperiode';

const TabellContainer = styled(Table)`
    background: white;
    --ac-table-row-border: ${ABorderDivider};
    --ac-table-row-hover: none;
    --ac-table-cell-hover-border: ${ABorderDivider};
`;

const RegisterYtelser: React.FC<{ grunnlag: VilkårperioderGrunnlag | undefined }> = ({
    grunnlag,
}) => {
    if (grunnlag === undefined) {
        return (
            <Alert variant={'info'} inline>
                Det ble ikke hentet ytelser fra register for denne behandlingen
            </Alert>
        );
    }

    const perioderMedYtelse = grunnlag.ytelse.perioder;
    const hentetInformasjon = grunnlag.hentetInformasjon;

    const opplysningerHentetTekst = `Opplysninger hentet fra Arena ${formaterNullableIsoDatoTid(hentetInformasjon.tidspunktHentet)}`;

    if (perioderMedYtelse.length === 0) {
        return (
            <Alert variant={'info'} inline>
                Vi finner ingen relevante ytelser registrert på bruker fra og med{' '}
                {formaterNullableIsoDato(hentetInformasjon.fom)} til og med{' '}
                {formaterNullableIsoDato(hentetInformasjon.tom)}
                <Detail>{opplysningerHentetTekst}</Detail>
            </Alert>
        );
    }

    return (
        <VStack>
            <ExpansionCard tittel="Relevante ytelser registrert på bruker" maxWidth={800}>
                <VStack gap="4">
                    <TabellContainer>
                        <Table size={'small'}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell scope="col">Ytelse</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Startdato</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Sluttdato</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {perioderMedYtelse.map((ytelse, indeks) => {
                                    return (
                                        <Table.Row key={indeks}>
                                            <Table.DataCell>
                                                {registerYtelseTilTekst[ytelse.type]}
                                            </Table.DataCell>
                                            <Table.DataCell>
                                                {formaterNullableIsoDato(ytelse.fom)}
                                            </Table.DataCell>
                                            <Table.DataCell>
                                                {formaterNullableIsoDato(ytelse.tom)}
                                            </Table.DataCell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    </TabellContainer>
                    <Detail>
                        <strong>{opplysningerHentetTekst}</strong>
                    </Detail>
                </VStack>
            </ExpansionCard>
        </VStack>
    );
};

export default RegisterYtelser;
