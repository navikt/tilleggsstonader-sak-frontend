import React, { FC } from 'react';

import { BodyShort, Heading, HStack, Table, Tag } from '@navikt/ds-react';

import { UkeInnhold } from './UkeInnhold';
import { TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import { UkeVurdering } from '../../../../typer/kjøreliste';
import { RammeForReiseMedPrivatBilDelperiode } from '../../../../typer/vedtak/vedtakDagligReise';
import { formaterNullableIsoDato } from '../../../../utils/dato';
import { utledUkeTag } from '../utils';

export const UkeRad: FC<{
    uke: UkeVurdering;
    oppdaterUke: (uke: UkeVurdering) => void;
    delperioder: RammeForReiseMedPrivatBilDelperiode[];
}> = ({ uke, oppdaterUke, delperioder }) => {
    const ukeTagInfo = utledUkeTag(uke);

    return (
        <Table.ExpandableRow
            content={<UkeInnhold uke={uke} oppdaterUke={oppdaterUke} delperioder={delperioder} />}
            defaultOpen={uke.status === 'AVVIK'}
        >
            <TableHeaderCellSmall>
                <HStack justify="space-between" align="center">
                    <Heading size="small">{`Uke ${uke.ukenummer}`}</Heading>
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
