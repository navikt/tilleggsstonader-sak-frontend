import React, { useState } from 'react';

import styled from 'styled-components';

import { BodyLong, Button, Heading, HStack, VStack } from '@navikt/ds-react';

import TaAvVentModal from './TaAvVentModal';
import { StatusSettPåVent, årsakTilTekst } from './typer';
import {
    formaterIsoDato,
    formaterNullableTilTekstligDato,
    formaterTilTekstligDato,
} from '../../utils/dato';

const Kommentar = styled(BodyLong)`
    white-space: pre-wrap;
`;

const SettPåVentInformasjon: React.FC<{
    status: StatusSettPåVent;
    statusPåVentRedigering: boolean;
    settStatusPåVentRedigering: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ status, statusPåVentRedigering, settStatusPåVentRedigering }) => {
    const [visTaAvVentModal, settVisTaAvVentModal] = useState<boolean>(false);

    const frist = status.frist ? formaterIsoDato(status.frist) : '';

    const datoSattPåVent = formaterTilTekstligDato(status.datoSattPåVent);

    return (
        <VStack gap={'4'}>
            <Heading size={'small'}>
                Satt på vent {datoSattPåVent} av {status.opprettetAv}
            </Heading>
            <VStack gap="2">
                {status.endretAv && (
                    <div>
                        <strong>Sist endret: </strong>
                        {formaterNullableTilTekstligDato(status.endretTid)} av {status.endretAv}
                    </div>
                )}
                <div>
                    <strong>Venter på: </strong>
                    {status.årsaker.map((årsak) => årsakTilTekst[årsak]).join(', ')}
                </div>
                <div>
                    <strong>Frist: </strong>
                    {frist}
                </div>
                <div>
                    <strong>Kommentar fra saksbehandler: </strong>
                    <Kommentar>{status.kommentar}</Kommentar>
                </div>
            </VStack>
            {!statusPåVentRedigering && (
                <HStack gap={'4'}>
                    <Button size={'small'} onClick={() => settStatusPåVentRedigering(true)}>
                        Oppdater
                    </Button>
                    <Button
                        size={'small'}
                        variant={'secondary'}
                        onClick={() => settVisTaAvVentModal(true)}
                    >
                        Ta av vent
                    </Button>
                </HStack>
            )}
            <TaAvVentModal
                visModal={visTaAvVentModal}
                skjulModal={() => settVisTaAvVentModal(false)}
            />
        </VStack>
    );
};

export default SettPåVentInformasjon;
