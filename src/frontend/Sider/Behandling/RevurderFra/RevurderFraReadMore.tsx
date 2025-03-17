import React from 'react';

import { BodyLong, List, ReadMore } from '@navikt/ds-react';

const RevurderFraReadMore = () => (
    <ReadMore header={'Slik setter du revurder fra-dato'} size={'small'} defaultOpen={true}>
        <BodyLong size={'small'}>
            Revurder-fra datoen skal som hovedregel være den første datoen det har skjedd en endring
            i situasjon for brukeren, for eksempel
        </BodyLong>
        <List as="ul" size={'small'}>
            <List.Item>dagen AAP forlenges fra </List.Item>
            <List.Item>oppstart på nytt tiltak</List.Item>
            <List.Item>dagen stønaden opphører</List.Item>
        </List>
        <BodyLong size={'small'}>
            Unntaket er hvis du skal legge til en ny utgift til pass av barn, da må du sette den 1.
            i den aktuelle måneden, fordi utgifter til pass av barn alltid skal legges inn for hele
            måneder
        </BodyLong>
    </ReadMore>
);

export default RevurderFraReadMore;
