import React from 'react';

import { styled } from 'styled-components';

import { Alert, Button, Detail, Table, VStack } from '@navikt/ds-react';
import { ABorderDivider } from '@navikt/ds-tokens/dist/tokens';

import { AktivitetGrunnlag } from './typer/vilkårperiode';
import { useInngangsvilkår } from '../../../context/InngangsvilkårContext';
import ExpansionCard from '../../../komponenter/ExpansionCard';
import { formaterNullableIsoDato, formaterNullableIsoDatoTid } from '../../../utils/dato';
import { erProd } from '../../../utils/miljø';
import { formaterEnumVerdi } from '../../../utils/tekstformatering';

const TabellContainer = styled(Table)`
    background: white;
    --ac-table-row-border: ${ABorderDivider};
    --ac-table-row-hover: none;
    --ac-table-cell-hover-border: ${ABorderDivider};
`;

const RegisterAktiviteter: React.FC<{ aktivitetGrunnlag: AktivitetGrunnlag | undefined }> = ({
    aktivitetGrunnlag,
}) => {
    const { leggTilAktivitetFraRegister } = useInngangsvilkår();

    if (aktivitetGrunnlag === undefined) {
        return (
            <Alert variant={'info'} inline>
                Det ble ikke hentet aktiviteter fra register for denne behandlingen
            </Alert>
        );
    }

    const opplysningerHentetTekst = `Opplysninger hentet fra Arena ${formaterNullableIsoDatoTid(aktivitetGrunnlag.tidspunktHentet)}`;

    if (aktivitetGrunnlag.aktiviteter.length === 0) {
        return (
            <Alert variant={'info'} inline>
                Bruker har ingen registrerte aktiviteter
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
                                    <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Startdato</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Sluttdato</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Aktivitetsdager</Table.HeaderCell>
                                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {aktivitetGrunnlag.aktiviteter.map((aktivitet) => {
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
                                                {!erProd() && (
                                                    <Button
                                                        size={'small'}
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
                    <Detail>
                        <strong>{opplysningerHentetTekst}</strong>
                    </Detail>
                </VStack>
            </ExpansionCard>
        </VStack>
    );
};

export default RegisterAktiviteter;
