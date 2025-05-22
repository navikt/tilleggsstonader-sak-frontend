import React from 'react';

import { BodyLong, List, ReadMore } from '@navikt/ds-react';

import { useBehandling } from '../../../context/BehandlingContext';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';

export const RevurderFraReadMore = () => (
    <ReadMore header={'Slik setter du revurder fra-dato'} size={'small'} defaultOpen={true}>
        <BodyLong size={'small'}>
            Revurder-fra datoen skal som hovedregel være den første datoen det har skjedd en endring
            i situasjon for brukeren, for eksempel
        </BodyLong>
        <List as="ul" size={'small'}>
            <List.Item>dagen tiltaket eller ytelsen forlenges fra</List.Item>
            <List.Item>oppstart på nytt tiltak</List.Item>
            <List.Item>dagen stønaden opphører</List.Item>
        </List>
        <EkstraInformasjon />
    </ReadMore>
);

const EkstraInformasjon = () => {
    const { behandling } = useBehandling();

    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN:
            return (
                <BodyLong size={'small'}>
                    Unntaket er hvis du skal legge til en ny utgift til pass av barn, da må du sette
                    den 1. i den aktuelle måneden, fordi utgifter til pass av barn alltid skal
                    legges inn for hele måneder
                </BodyLong>
            );
        case Stønadstype.BOUTGIFTER:
            return (
                <BodyLong size={'small'}>
                    Unntaket er hvis du skal legge til en ny løpende utgift til bolig, da må du
                    sette den 1. i den aktuelle måneden, fordi løpende utgifter til bolig alltid
                    skal legges inn for hele måneder
                </BodyLong>
            );
        default:
            return null;
    }
};
