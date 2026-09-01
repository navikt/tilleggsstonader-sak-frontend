import React, { FC } from 'react';

import {
    CogRotationIcon,
    ExclamationmarkTriangleIcon,
    PersonHeadsetIcon,
} from '@navikt/aksel-icons';
import { BodyShort, HStack, Label, Table, Tag } from '@navikt/ds-react';

import { UkeInnhold } from './UkeInnhold';
import styles from './UkeRad.module.css';
import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import { AvklartKjørtUkeStatus, UkeStatus, UkeVurdering } from '../../../../typer/kjøreliste';
import { RammeForReiseMedPrivatBilDelperiode } from '../../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoPeriode, formaterNullableIsoDato } from '../../../../utils/dato';
import { harVerdi } from '../../../../utils/utils';
import { finnDelperiodeForUke } from '../utils';

export const UkeRad: FC<{
    uke: UkeVurdering;
    oppdaterUke: (uke: UkeVurdering) => void;
    delperioder: RammeForReiseMedPrivatBilDelperiode[];
}> = ({ uke, oppdaterUke, delperioder }) => {
    const relevantDelperiodeForUke = finnDelperiodeForUke(delperioder, uke);
    const skalHaSlettetStyling =
        uke.erUkeSlettet && uke.avklartKjørtUkeStatus !== AvklartKjørtUkeStatus.SLETTET;

    const erUtbetalt =
        uke.avklartKjørtUkeStatus !== AvklartKjørtUkeStatus.NY &&
        harVerdi(uke.avklartKjørtUkeStatus);

    return (
        <Table.ExpandableRow
            content={
                <UkeInnhold
                    uke={uke}
                    oppdaterUke={oppdaterUke}
                    delperiodeForUke={relevantDelperiodeForUke}
                />
            }
            defaultOpen={uke.status === 'AVVIK'}
        >
            <TableHeaderCellSmall className={styles.ukeKolonne}>
                <Label size="small" className={skalHaSlettetStyling ? styles.slettet : undefined}>
                    {uke.ukenummer}
                </Label>
            </TableHeaderCellSmall>
            <TableDataCellSmall
                className={`${styles.periodeKolonne} ${skalHaSlettetStyling ? styles.slettet : undefined}`}
            >
                {formaterIsoPeriode(uke.fraDato, uke.tilDato)}
            </TableDataCellSmall>
            <TableHeaderCellSmall>
                <AutomatiskManuellEllerAvvikTag status={uke.status} />
            </TableHeaderCellSmall>
            <TableHeaderCellSmall className={styles.statusKolonne} align="center">
                <AvklartKjørtUkeStatusTag avklartKjørtUkeStatus={uke.avklartKjørtUkeStatus} />
            </TableHeaderCellSmall>
            <TableDataCellSmall className={styles.utbetaltKolonne} align="center">
                {erUtbetalt && 'Ja'}
            </TableDataCellSmall>
            <TableDataCellSmall className={styles.levertDatoKolonne}>
                {uke.erKjørelisteManueltRegistrert
                    ? 'Manuelt registrert'
                    : uke.kjørelisteInnsendtDato &&
                      formaterNullableIsoDato(uke.kjørelisteInnsendtDato)}
            </TableDataCellSmall>
        </Table.ExpandableRow>
    );
};

const AutomatiskManuellEllerAvvikTag: FC<{ status: UkeStatus }> = ({ status }) => {
    switch (status) {
        case UkeStatus.OK_AUTOMATISK:
            return (
                <HStack align="center" gap="space-4">
                    <CogRotationIcon />
                    <BodyShort size="small">Automatisk</BodyShort>
                </HStack>
            );
        case UkeStatus.OK_MANUELT:
            return (
                <HStack align="center" gap="space-4">
                    <PersonHeadsetIcon />
                    <BodyShort size="small">Manuell</BodyShort>
                </HStack>
            );
        case UkeStatus.AVVIK:
            return (
                <Tag size="small" data-color="danger" icon={<ExclamationmarkTriangleIcon />}>
                    Avvik
                </Tag>
            );
        default:
            return null;
    }
};

const AvklartKjørtUkeStatusTag: FC<{ avklartKjørtUkeStatus: AvklartKjørtUkeStatus | null }> = ({
    avklartKjørtUkeStatus,
}) => {
    switch (avklartKjørtUkeStatus) {
        case AvklartKjørtUkeStatus.NY:
            return (
                <Tag size="small" data-color="success">
                    Ny
                </Tag>
            );
        case AvklartKjørtUkeStatus.ENDRET:
            return (
                <Tag size="small" data-color="warning">
                    Endret
                </Tag>
            );
        case AvklartKjørtUkeStatus.SLETTET:
            return (
                <Tag size="small" data-color="danger">
                    Slettet
                </Tag>
            );

        default:
            return null;
    }
};
