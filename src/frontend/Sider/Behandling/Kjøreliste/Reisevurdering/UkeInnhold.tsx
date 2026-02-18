import React, { FC } from 'react';

import { InlineMessage, Label, VStack } from '@navikt/ds-react';

import { DagInfoLeservisning } from './DagvurderingLesevisning';
import styles from './UkeInnhold.module.css';
import { UkeVurdering } from '../../../../typer/kjøreliste';

export const UkeInnhold: FC<{ uke: UkeVurdering }> = ({ uke }) => {
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
                    <DagInfoLeservisning key={dagIndeks} dag={dag} />
                ))}
            </div>
        </VStack>
    );
};
