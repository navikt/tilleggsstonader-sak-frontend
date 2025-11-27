import React from 'react';

import { BodyShort, HStack, Label, VStack } from '@navikt/ds-react';

import styles from './Kjøreavstand.module.css';
import { Reiserute } from './Typer/Reisedata';
import { meterTilKm, sekunderTilTimerOgMinutter } from './utils';

type Props = {
    rute: Reiserute;
};

export const Kjøreavstand: React.FC<Props> = ({ rute }: Props) => {
    return (
        <HStack gap={'2'}>
            <VStack className={styles.kort}>
                <Label>Reiseavstand</Label>
                <BodyShort>{meterTilKm(rute.avstandMeter)} km</BodyShort>
            </VStack>
            <VStack className={styles.kort}>
                <Label>Estimert tid</Label>
                <BodyShort>{sekunderTilTimerOgMinutter(rute.varighetSekunder)}</BodyShort>
            </VStack>
        </HStack>
    );
};
