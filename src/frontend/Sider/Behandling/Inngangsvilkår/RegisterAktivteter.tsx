import React from 'react';

import { styled } from 'styled-components';

import { Alert, Button, Detail, HStack, HelpText, Table, VStack } from '@navikt/ds-react';
import { ABorderDivider } from '@navikt/ds-tokens/dist/tokens';

import { VilkårperioderGrunnlag } from './typer/vilkårperiode';
import { useInngangsvilkår } from '../../../context/InngangsvilkårContext';
import { useSteg } from '../../../context/StegContext';
import ExpansionCard from '../../../komponenter/ExpansionCard';
import { formaterNullableIsoDato, formaterNullableIsoDatoTid } from '../../../utils/dato';
import { formaterEnumVerdi } from '../../../utils/tekstformatering';

const TabellContainer = styled(Table)`
    background: white;
    --ac-table-row-border: ${ABorderDivider};
    --ac-table-row-hover: none;
    --ac-table-cell-hover-border: ${ABorderDivider};
`;

const RegisterAktiviteter: React.FC<{ grunnlag: VilkårperioderGrunnlag | undefined }> = ({
    grunnlag,
}) => {
    const { erStegRedigerbart } = useSteg();
    const { leggTilAktivitetFraRegister } = useInngangsvilkår();

    if (grunnlag === undefined) {
        return (
            <Alert variant={'info'} inline size="small">
                Det ble ikke hentet aktiviteter fra register for denne behandlingen
            </Alert>
        );
    }

    const aktiviteter = grunnlag.aktivitet.aktiviteter;
    const hentetInformasjon = grunnlag.hentetInformasjon;

    const opplysningerHentetTekst = `Opplysninger hentet fra Arena ${formaterNullableIsoDatoTid(hentetInformasjon.tidspunktHentet)} for perioden ${formaterNullableIsoDato(hentetInformasjon.fom)} - ${formaterNullableIsoDato(hentetInformasjon.tom)}`;

    if (aktiviteter.length === 0) {
        return (
            <Alert variant={'info'} inline size="small">
                Vi fant ingen stønadsberettigede aktiviteteter registrert på bruker.
                <Detail>{opplysningerHentetTekst}</Detail>
            </Alert>
        );
    }

    return (
        <VStack>
            <ExpansionCard tittel="Aktiviteter registrert på bruker" maxWidth={800}>
                <VStack gap="4">
                    <TabellContainer>
                        <Table size={'small'}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell scope="col">Aktivitet</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Startdato</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Sluttdato</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Aktivitetsdager</Table.HeaderCell>
                                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {aktiviteter.map((aktivitet) => {
                                    return (
                                        <Table.Row key={aktivitet.id}>
                                            <Table.DataCell>{aktivitet.typeNavn}</Table.DataCell>
                                            <Table.DataCell>
                                                {aktivitet.status &&
                                                    formaterEnumVerdi(aktivitet.status)}
                                            </Table.DataCell>
                                            <Table.DataCell>
                                                {formaterNullableIsoDato(aktivitet.fom)}
                                            </Table.DataCell>
                                            <Table.DataCell>
                                                {formaterNullableIsoDato(aktivitet.tom)}
                                            </Table.DataCell>
                                            <Table.DataCell>
                                                {aktivitet.antallDagerPerUke}
                                            </Table.DataCell>
                                            <Table.DataCell>
                                                {erStegRedigerbart && (
                                                    <Button
                                                        size="xsmall"
                                                        onClick={() =>
                                                            leggTilAktivitetFraRegister(aktivitet)
                                                        }
                                                    >
                                                        Bruk
                                                    </Button>
                                                )}
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
                            Vi henter kun stønadsberettigede aktiviteter fra Arena. Du finner alle
                            aktiviteter i personoversikten.
                        </HelpText>
                    </HStack>
                </VStack>
            </ExpansionCard>
        </VStack>
    );
};

export default RegisterAktiviteter;
