import React from 'react';

import { BodyShort, List, VStack, Box } from '@navikt/ds-react';

import styles from './InformasjonOppfølging.module.css';

export const InformasjonOppfølging = () => (
    <div>
        <VStack gap={'space-8'}>
            <BodyShort>Her vises behadlinger som trenger oppfølging</BodyShort>
            <BodyShort size={'small'}>
                En behandling kan ha en eller flere årsaker til oppfølging:
            </BodyShort>
            <div className={styles.liteUtenMargins}>
                <Box marginBlock="space-16" asChild>
                    <List data-aksel-migrated-v8 size={'small'}>
                        <List.Item>Ingen treff mot registeret</List.Item>
                        <List.Item>Fom. starter senere</List.Item>
                        <List.Item>Tom. slutter tidligere</List.Item>
                        <List.Item>Feil type aktivitet</List.Item>
                    </List>
                </Box>
            </div>
            <BodyShort size={'small'}>
                Hver rad inneholder lenke til behandling. Hver rad viser kan ekspanderes for å vise
                mer detaljer om hvilke perioder som har endret seg.
            </BodyShort>
            <BodyShort size={'small'} spacing>
                Hvis du er usikker, spør på teams.
            </BodyShort>
        </VStack>
    </div>
);
