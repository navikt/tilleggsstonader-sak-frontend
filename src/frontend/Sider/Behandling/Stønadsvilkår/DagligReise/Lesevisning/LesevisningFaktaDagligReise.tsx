import React, { FC } from 'react';

import { BodyShort, Table } from '@navikt/ds-react';

import styles from './LesevisningFaktaDagligReise.module.css';
import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../../komponenter/TabellSmall';
import { formaterIsoPeriode } from '../../../../../utils/dato';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../../../utils/fomatering';
import {
    FaktaDagligReise,
    FaktaOffentligTransport,
    FaktaPrivatBil,
} from '../typer/faktaDagligReise';

export const LesevisningFaktaDagligReise: FC<{
    fakta: FaktaDagligReise | undefined;
}> = ({ fakta }) => {
    if (!fakta) return null;

    switch (fakta.type) {
        case 'OFFENTLIG_TRANSPORT':
            return <LesevisningFaktaOffentligTransport fakta={fakta as FaktaOffentligTransport} />;

        case 'PRIVAT_BIL':
            return <LesevisningFaktaPrivatBil fakta={fakta as FaktaPrivatBil} />;

        default:
            return null;
    }
};

const LesevisningFaktaOffentligTransport: FC<{
    fakta: FaktaOffentligTransport;
}> = ({ fakta }) => {
    return (
        <div className={styles.grid}>
            <BodyShort size="small">{'Reisedager pr uke'}</BodyShort>
            <BodyShort size="small">
                {fakta?.reisedagerPerUke ? `${fakta.reisedagerPerUke}` : '-'}
            </BodyShort>

            <BodyShort size="small">{'Pris enkeltbillett'}</BodyShort>
            <BodyShort size="small">
                {fakta?.prisEnkelbillett
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta.prisEnkelbillett)} kr`
                    : '-'}
            </BodyShort>

            <BodyShort size="small">{'Pris 7-dagersbillett'}</BodyShort>
            <BodyShort size="small">
                {fakta?.prisSyvdagersbillett
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta?.prisSyvdagersbillett)} kr`
                    : '-'}
            </BodyShort>

            <BodyShort size="small">{'Pris 30-dagersbillett'}</BodyShort>
            <BodyShort size="small">
                {fakta?.prisTrettidagersbillett
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta.prisTrettidagersbillett)} kr`
                    : '-'}
            </BodyShort>
        </div>
    );
};

const LesevisningFaktaPrivatBil: FC<{
    fakta: FaktaPrivatBil;
}> = ({ fakta }) => {
    return (
        <>
            <Table size={'small'}>
                <Table.Header>
                    <Table.Row>
                        <TableHeaderCellSmall scope={'col'} style={{ width: '50%' }}>
                            Periode
                        </TableHeaderCellSmall>
                        <TableHeaderCellSmall scope={'col'} style={{ width: '16.6%' }}>
                            Reisedager pr. uke
                        </TableHeaderCellSmall>
                        <TableHeaderCellSmall scope={'col'} style={{ width: '16.6%' }}>
                            Bom pr. dag
                        </TableHeaderCellSmall>
                        <TableHeaderCellSmall scope={'col'} style={{ width: '16.6%' }}>
                            Ferge pr. dag
                        </TableHeaderCellSmall>
                    </Table.Row>
                </Table.Header>
                <Table.Body style={{ verticalAlign: 'top' }}>
                    {fakta.faktaDelperioder.map((periode, index) => (
                        <Table.Row key={index}>
                            <TableDataCellSmall>
                                {formaterIsoPeriode(periode.fom, periode.tom)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {periode?.reisedagerPerUke ? `${periode.reisedagerPerUke}` : '-'}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {' '}
                                {periode?.bompengerPerDag
                                    ? `${formaterTallMedTusenSkilleEllerStrek(periode?.bompengerPerDag)} kr`
                                    : '-'}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {periode?.fergekostnadPerDag
                                    ? `${formaterTallMedTusenSkilleEllerStrek(periode.fergekostnadPerDag)} kr`
                                    : '-'}
                            </TableDataCellSmall>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </>
    );
};
