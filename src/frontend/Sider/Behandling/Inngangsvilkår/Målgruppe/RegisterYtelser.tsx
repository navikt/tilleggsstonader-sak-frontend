import React from 'react';

import { styled } from 'styled-components';

import { Alert, Detail, HStack, HelpText, Table, VStack } from '@navikt/ds-react';
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
            <Alert variant={'info'} inline size="small">
                Det ble ikke hentet ytelser fra register for denne behandlingen
            </Alert>
        );
    }

    const perioderMedYtelse = grunnlag.ytelse.perioder;
    const hentetInformasjon = grunnlag.hentetInformasjon;

    const opplysningerHentetTekst = `Opplysninger hentet fra Arena ${formaterNullableIsoDatoTid(hentetInformasjon.tidspunktHentet)} for perioden ${formaterNullableIsoDato(hentetInformasjon.fom)} - ${formaterNullableIsoDato(hentetInformasjon.tom)}`;

    if (perioderMedYtelse.length === 0) {
        return (
            <Alert variant={'info'} inline size="small">
                Vi finner ingen relevante ytelser registrert på bruker fra og med{' '}
                {formaterNullableIsoDato(hentetInformasjon.fom)} til og med{' '}
                {formaterNullableIsoDato(hentetInformasjon.tom)}
                <Detail>{opplysningerHentetTekst}</Detail>
            </Alert>
        );
    }

    return (
        <VStack>
            <ExpansionCard tittel="Relevante ytelser registrert på bruker" maxWidth={600}>
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
                    <HStack gap="2" align="center">
                        <Detail>
                            <strong>{opplysningerHentetTekst}</strong>
                        </Detail>
                        <HelpText>
                            Vi henter kun perioder med arbeidsavklaringspenger, rett til
                            overgangsstønad og omstillingsstønad.
                        </HelpText>
                    </HStack>
                </VStack>
            </ExpansionCard>
        </VStack>
    );
};

export default RegisterYtelser;
