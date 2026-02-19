import React, { FC } from 'react';

import { BodyShort, Heading, HStack, Table, Tag } from '@navikt/ds-react';

import { UkeInnhold } from './UkeInnhold';
import { TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import { ReisevurderingPrivatBil, UkeVurdering } from '../../../../typer/kjøreliste';
import { formaterNullableIsoDato } from '../../../../utils/dato';
import { utledUkeTag } from '../utils';

export const Reisevurdering: FC<{ kjøreliste: ReisevurderingPrivatBil | undefined }> = ({
    kjøreliste,
}) => {
    return (
        <Table size="small">
            <Table.Body>
                {kjøreliste?.uker.map((uke, index) => (
                    <UkeRad uke={uke} key={index} />
                ))}
            </Table.Body>
        </Table>
    );
};

const UkeRad: FC<{ uke: UkeVurdering }> = ({ uke }) => {
    const ukeTagInfo = utledUkeTag(uke);

    return (
        <Table.ExpandableRow
            content={<UkeInnhold uke={uke} />}
            defaultOpen={uke.status !== 'OK_AUTOMATISK'}
        >
            <TableHeaderCellSmall>
                <HStack justify="space-between" align="center">
                    <Heading size="small">{`Uke ${uke.ukenummer}`}</Heading>
                    <HStack gap="4" align="center">
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
