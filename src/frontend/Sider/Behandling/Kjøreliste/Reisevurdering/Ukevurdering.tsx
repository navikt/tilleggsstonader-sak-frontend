import React, { FC } from 'react';

import { BodyShort, Heading, HStack, Table, Tag } from '@navikt/ds-react';

import { UkeInnhold } from './UkeInnhold';
import { TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import { UkeVurdering } from '../../../../typer/kjøreliste';
import { formaterNullableIsoDato } from '../../../../utils/dato';
import { utledUkeTag } from '../utils';

export const Ukevurdering: FC<{ uke: UkeVurdering }> = ({ uke }) => {
    const ukeTagInfo = utledUkeTag(uke);

    return (
        <Table.ExpandableRow
            content={<UkeInnhold uke={uke} />}
            defaultOpen={uke.status !== 'OK_AUTOMATISK'}
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
                            Levert {formaterNullableIsoDato(uke.kjørelisteInnsendtDato)}
                        </BodyShort>
                    </HStack>
                </HStack>
            </TableHeaderCellSmall>
        </Table.ExpandableRow>
    );
};
