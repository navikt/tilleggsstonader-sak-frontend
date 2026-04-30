import React, { FC } from 'react';

import { BodyShort, Heading, HStack, Label, Table, Tag } from '@navikt/ds-react';

import { UkeInnhold } from './UkeInnhold';
import styles from './UkeRad.module.css';
import { TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import { UkeVurdering } from '../../../../typer/kjøreliste';
import { RammeForReiseMedPrivatBilDelperiode } from '../../../../typer/vedtak/vedtakDagligReise';
import {
    formaterIsoPeriode,
    formaterNullableIsoDato,
    perioderOverlapper,
} from '../../../../utils/dato';
import { utledUkeTag } from '../utils';

export const UkeRad: FC<{
    uke: UkeVurdering;
    oppdaterUke: (uke: UkeVurdering) => void;
    delperioder: RammeForReiseMedPrivatBilDelperiode[];
}> = ({ uke, oppdaterUke, delperioder }) => {
    const ukeTagInfo = utledUkeTag(uke);

    const relevantDelperiodeForUke = delperioder.find((delperiode) =>
        perioderOverlapper(delperiode, { fom: uke.fraDato, tom: uke.tilDato })
    );

    return (
        <Table.ExpandableRow
            content={<UkeInnhold uke={uke} oppdaterUke={oppdaterUke} delperioder={delperioder} />}
            defaultOpen={uke.status === 'AVVIK'}
        >
            <TableHeaderCellSmall>
                <HStack justify="space-between" align="center">
                    <div className={styles.grid}>
                        <Heading size="small">{`Uke ${uke.ukenummer}`}</Heading>
                        <HStack gap="space-24">
                            <HStack gap="space-4" wrap={false}>
                                <Label size="small">Periode:</Label>
                                <BodyShort size="small">
                                    {formaterIsoPeriode(uke.fraDato, uke.tilDato)}
                                </BodyShort>
                            </HStack>
                            <HStack gap="space-4" wrap={false}>
                                <Label size="small">Reisedager ramme per uke:</Label>
                                <BodyShort size="small">
                                    {relevantDelperiodeForUke?.reisedagerPerUke ?? '-'}
                                </BodyShort>
                            </HStack>
                        </HStack>
                    </div>
                    <HStack gap="space-16" align="center">
                        {ukeTagInfo && (
                            <Tag size="small" variant={ukeTagInfo.variant}>
                                {ukeTagInfo.label}
                            </Tag>
                        )}
                        <BodyShort size="small">
                            {uke.kjørelisteInnsendtDato
                                ? `Levert ${formaterNullableIsoDato(uke.kjørelisteInnsendtDato)}`
                                : 'Ikke innsendt'}
                        </BodyShort>
                    </HStack>
                </HStack>
            </TableHeaderCellSmall>
        </Table.ExpandableRow>
    );
};
