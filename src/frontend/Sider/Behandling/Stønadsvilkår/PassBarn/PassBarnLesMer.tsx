import React from 'react';

import { BodyLong, ReadMore, List, Box } from '@navikt/ds-react';

export const PassBarnLesMer = () => {
    return (
        <ReadMore header={'Slik legger du inn utgifter'} size={'small'}>
            <BodyLong size="small">Perioden for utgiften skal settes til:</BodyLong>
            <Box marginBlock="space-12" asChild>
                <List data-aksel-migrated-v8 size="small">
                    <List.Item>
                        fra og med første mulig dato i dette skoleåret hvor bruker har rettighet.
                    </List.Item>
                    <List.Item>
                        til og med så lenge søker har rett på tilleggsstønad, men maks ut juni i
                        gjeldende skoleår
                    </List.Item>
                </List>
            </Box>
            <BodyLong size={'small'} spacing>
                Hvis et barn har har ulike utgifter fra en måned til en annen, kan du legge til
                flere perioder med utgift.
            </BodyLong>
            <BodyLong size={'small'}>
                Månedlig utgift skal bare være utgifter til pass. Utgifter til mat eller bleier må
                eventuelt trekkes fra før du legger inn summen.
            </BodyLong>
        </ReadMore>
    );
};
