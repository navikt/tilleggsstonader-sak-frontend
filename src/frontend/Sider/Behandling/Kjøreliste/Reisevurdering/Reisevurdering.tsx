import React, { FC } from 'react';

import { ExclamationmarkTriangleFillIcon, PencilIcon } from '@navikt/aksel-icons';
import {
    BodyShort,
    Button,
    Heading,
    HStack,
    InlineMessage,
    Label,
    Table,
    Tag,
    VStack,
} from '@navikt/ds-react';
import { BgWarningStrong } from '@navikt/ds-tokens/darkside-js';

import styles from './ReiseVurdering.module.css';
import { TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import { ReisevurderingPrivatBil, UkeVurdering, Dag } from '../../../../typer/kjøreliste';
import {
    formaterIsoDato,
    formaterNullableIsoDato,
    ukedagTilKortNorsk,
} from '../../../../utils/dato';
import { formatBoolean } from '../../../../utils/tekstformatering';
import { harAvvikPåParkeringsutgift, utledUkeTag } from '../utils';

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

const UkeInnhold: FC<{ uke: UkeVurdering }> = ({ uke }) => {
    return (
        <VStack gap="4" align="start">
            {uke.avvik && (
                <InlineMessage size="small" status="warning">
                    {uke.avvik.typeAvvik}
                </InlineMessage>
            )}
            <div className={styles.grid}>
                <Label size="small">
                    <u>Dag</u>
                </Label>
                <Label size="small">
                    <u>Dato</u>
                </Label>
                <Label size="small">
                    <u>Har kjørt</u>
                </Label>
                <Label size="small">
                    <u>Parking</u>
                </Label>
                <Label size="small">
                    <u>Automatisk vurdering</u>
                </Label>
                <Label size="small">
                    <u>Avvik</u>
                </Label>
                {uke.dager.map((dag, dagIndeks) => (
                    <DagInfo key={dagIndeks} dag={dag} />
                ))}
            </div>
            <Button variant="secondary" size="small" icon={<PencilIcon />}>
                Rediger
            </Button>
        </VStack>
    );
};

const DagInfo: FC<{ dag: Dag }> = ({ dag }) => {
    const parkeringsutgift = dag.kjørelisteDag?.parkeringsutgift || '-';
    const dagHarForHøyParkeringsutgift = harAvvikPåParkeringsutgift(dag);

    return (
        <React.Fragment>
            <BodyShort size="small">{ukedagTilKortNorsk[dag.ukedag]}</BodyShort>
            <BodyShort size="small">{formaterIsoDato(dag.dato)}</BodyShort>
            <BodyShort size="small">{formatBoolean(dag.kjørelisteDag?.harKjørt)}</BodyShort>
            <HStack>
                <BodyShort size="small">{parkeringsutgift} </BodyShort>
                {dagHarForHøyParkeringsutgift && (
                    <ExclamationmarkTriangleFillIcon color={BgWarningStrong} />
                )}
            </HStack>
            <BodyShort size="small">{dag.avklartDag?.automatiskVurdering}</BodyShort>
            <BodyShort size="small">{dag.avklartDag?.avvik}</BodyShort>
        </React.Fragment>
    );
};
