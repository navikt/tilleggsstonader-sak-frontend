import React from 'react';

import { BodyShort, Button, HStack, Table } from '@navikt/ds-react';

import { HjelpetekstDagpenger } from './HjelpetekstDagpenger';
import styles from './RegisterYtelserTabell.module.css';
import { utledYtelseTekst } from './utils';
import { useSteg } from '../../../../context/StegContext';
import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import { TypeRegisterYtelse } from '../../../../typer/registerytelser';
import { formaterIsoDato, formaterNullableIsoDato } from '../../../../utils/dato';
import { YtelseGrunnlagPeriode } from '../typer/vilkårperiode/vilkårperiode';

const RegisterYtelserTabell: React.FC<{
    perioderMedYtelse: YtelseGrunnlagPeriode[];
    lagRadForPeriode: (valgPeriode: YtelseGrunnlagPeriode) => void;
}> = ({ perioderMedYtelse, lagRadForPeriode }) => {
    const { erStegRedigerbart } = useSteg();

    return (
        <Table size="small" className={styles.hvitTabell}>
            <Table.Header>
                <Table.Row>
                    <TableHeaderCellSmall scope="col">Ytelse</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col">Startdato</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col">Sluttdato</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col" />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {perioderMedYtelse.map((ytelse, indeks) => {
                    return (
                        <Table.Row key={indeks}>
                            <TableDataCellSmall>{utledYtelseTekst(ytelse)}</TableDataCellSmall>
                            <TableDataCellSmall>{formaterIsoDato(ytelse.fom)}</TableDataCellSmall>
                            <TableDataCellSmall>
                                {ytelse.tom ? (
                                    formaterNullableIsoDato(ytelse.tom)
                                ) : (
                                    <HStack gap={'space-4'} align={'center'}>
                                        <BodyShort size={'small'}>Ukjent</BodyShort>
                                        {ytelse.type === TypeRegisterYtelse.DAGPENGER && (
                                            <HjelpetekstDagpenger
                                                gjennståendeDagerFraTelleverk={
                                                    ytelse.gjennståendeDagerFraTelleverk
                                                }
                                            />
                                        )}
                                    </HStack>
                                )}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {erStegRedigerbart && ytelse.kanYtelseBrukesIBehandling && (
                                    <Button size="xsmall" onClick={() => lagRadForPeriode(ytelse)}>
                                        Bruk
                                    </Button>
                                )}
                            </TableDataCellSmall>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};

export default RegisterYtelserTabell;
