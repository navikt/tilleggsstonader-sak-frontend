import React from 'react';

import { Alert, BodyShort, HGrid, Label, VStack } from '@navikt/ds-react';

import styles from './Reiseavstand.module.css';
import { Reisedata } from './Typer/Reisedata';
import { meterTilKm, sekunderTilTimerOgMinutter } from './utils';

export const Reiseavstand: React.FC<{ reisedata: Reisedata }> = ({ reisedata }) => {
    if (!reisedata.reiserute) {
        return <Alert variant={'warning'}>Fant ikke kjørerute for reisen</Alert>;
    }

    const erFerjePåReisen =
        reisedata.reiserute.avstandUtenFerje !== reisedata.reiserute.avstandMeter;

    return (
        <HGrid gap={'2'} columns={2}>
            <VStack className={styles.kort}>
                <Label>Reiseavstand totalt</Label>
                <BodyShort>{meterTilKm(reisedata.reiserute.avstandMeter)} km</BodyShort>
            </VStack>
            <VStack className={styles.kort}>
                <Label>Estimert tid</Label>
                <BodyShort>
                    {sekunderTilTimerOgMinutter(reisedata.reiserute.varighetSekunder)}
                </BodyShort>
            </VStack>
            <VStack className={styles.kort}>
                <Label>Reiseavstand eks.ferje</Label>
                {erFerjePåReisen ? (
                    <BodyShort>{meterTilKm(reisedata.reiserute.avstandUtenFerje)} km</BodyShort>
                ) : (
                    <BodyShort>Ingen ferje</BodyShort>
                )}
            </VStack>
        </HGrid>
    );
};
