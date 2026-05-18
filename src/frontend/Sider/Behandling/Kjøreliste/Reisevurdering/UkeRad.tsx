import React, { FC } from 'react';

import {
    CogRotationIcon,
    ExclamationmarkTriangleIcon,
    PersonHeadsetIcon,
} from '@navikt/aksel-icons';
import { BodyShort, Heading, HStack, Table, Tag } from '@navikt/ds-react';

import { UkeInnhold } from './UkeInnhold';
import styles from './UkeRad.module.css';
import { TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import { AvklartKjørtUkeStatus, UkeStatus, UkeVurdering } from '../../../../typer/kjøreliste';
import { RammeForReiseMedPrivatBilDelperiode } from '../../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoPeriode, formaterNullableIsoDato } from '../../../../utils/dato';
import { finnDelperiodeForUke } from '../utils';

export const UkeRad: FC<{
    uke: UkeVurdering;
    oppdaterUke: (uke: UkeVurdering) => void;
    delperioder: RammeForReiseMedPrivatBilDelperiode[];
}> = ({ uke, oppdaterUke, delperioder }) => {
    const relevantDelperiodeForUke = finnDelperiodeForUke(delperioder, uke);

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
            <TableHeaderCellSmall>
                <HStack justify="space-between" align="center">
                    <div className={styles.grid}>
                        <Heading size="small">{`Uke ${uke.ukenummer}`}</Heading>
                        <HStack gap="space-40">
                            <BodyShort size="small">
                                {formaterIsoPeriode(uke.fraDato, uke.tilDato)}
                            </BodyShort>
                            <AutomatiskManuellEllerAvvikTag status={uke.status} />
                        </HStack>
                    </div>
                    <HStack gap="space-40" align="center">
                        <AvklartKjørtUkeStatusTag
                            avklartKjørtUkeStatus={uke.avklartKjørtUkeStatus}
                        />
                        {uke.kjørelisteInnsendtDato && (
                            <BodyShort size="small">
                                Levert {formaterNullableIsoDato(uke.kjørelisteInnsendtDato)}
                            </BodyShort>
                        )}
                    </HStack>
                </HStack>
            </TableHeaderCellSmall>
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

const AvklartKjørtUkeStatusTag: FC<{ avklartKjørtUkeStatus: AvklartKjørtUkeStatus }> = ({
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
        case AvklartKjørtUkeStatus.UENDRET:
            return <BodyShort size="small">Utbetalt</BodyShort>;

        default:
            return null;
    }
};
