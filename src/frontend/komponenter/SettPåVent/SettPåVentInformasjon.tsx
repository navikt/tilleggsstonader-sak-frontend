import React, { useState } from 'react';

import styled from 'styled-components';

import { BodyLong, BodyShort, Button, Heading, HStack, VStack } from '@navikt/ds-react';

import { TaAvVentKnapp } from './TaAvVentKnapp';
import { StatusSettPåVent, årsakTilTekst } from './typer';
import {
    formaterIsoDato,
    formaterNullableTilTekstligDato,
    formaterTilTekstligDato,
} from '../../utils/dato';
import { Feilmelding } from '../Feil/Feilmelding';
import { Feil } from '../Feil/feilmeldingUtils';

const Kommentar = styled(BodyLong)`
    white-space: pre-wrap;
`;

const SettPåVentInformasjon: React.FC<{
    status: StatusSettPåVent;
    statusPåVentRedigering: boolean;
    settStatusPåVentRedigering: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ status, statusPåVentRedigering, settStatusPåVentRedigering }) => {
    const frist = status.frist ? formaterIsoDato(status.frist) : '';
    const datoSattPåVent = formaterTilTekstligDato(status.datoSattPåVent);
    const [kanTaAvVentFeil, settKanTaAvVentFeil] = useState<Feil | string>();

    return (
        <VStack gap={'4'}>
            <Heading size={'small'}>
                Satt på vent {datoSattPåVent} av {status.opprettetAv}
            </Heading>
            <VStack gap="2">
                {status.endretAv && (
                    <BodyShort size="small">
                        <strong>Sist endret: </strong>
                        {formaterNullableTilTekstligDato(status.endretTid)} av {status.endretAv}
                    </BodyShort>
                )}
                <BodyShort size="small">
                    <strong>Venter på: </strong>
                    {status.årsaker.map((årsak) => årsakTilTekst[årsak]).join(', ')}
                </BodyShort>
                <BodyShort size="small">
                    <strong>Frist: </strong>
                    {frist}
                </BodyShort>
                <BodyShort size="small">
                    <strong>Kommentar fra saksbehandler: </strong>
                    <Kommentar>{status.kommentar}</Kommentar>
                </BodyShort>
            </VStack>
            <Feilmelding feil={kanTaAvVentFeil} />
            {!statusPåVentRedigering && (
                <HStack gap={'4'}>
                    <Button size={'small'} onClick={() => settStatusPåVentRedigering(true)}>
                        Oppdater
                    </Button>
                    <TaAvVentKnapp settTaAvVentFeil={settKanTaAvVentFeil} />
                </HStack>
            )}
        </VStack>
    );
};

export default SettPåVentInformasjon;
