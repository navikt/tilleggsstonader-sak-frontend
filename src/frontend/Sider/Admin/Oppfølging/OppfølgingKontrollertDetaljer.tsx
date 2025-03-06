import React from 'react';

import styled from 'styled-components';

import { BodyShort, Button, Detail, VStack } from '@navikt/ds-react';

import { Oppfølging, oppfølgingUtfallTilTekst } from './oppfølgingTyper';
import { formaterIsoDatoTid } from '../../../utils/dato';

const Kommentar = styled(Detail)`
    white-space: pre-wrap;
`;

export const OppfølgingKontrollertDetaljer = ({
    kontrollert,
    rediger,
}: {
    kontrollert: NonNullable<Oppfølging['kontrollert']>;
    rediger: () => void;
}) => {
    return (
        <VStack align={'start'}>
            <BodyShort>Kontrollert: {formaterIsoDatoTid(kontrollert.tidspunkt)}</BodyShort>
            <BodyShort>Kontrollert av: {kontrollert.saksbehandler}</BodyShort>
            <BodyShort>Utfall: {oppfølgingUtfallTilTekst[kontrollert.utfall]}</BodyShort>
            {kontrollert.kommentar && <BodyShort>Kommentar:</BodyShort>}
            {kontrollert.kommentar && <Kommentar>{kontrollert.kommentar}</Kommentar>}
            {!kontrollert.kommentar && <Detail>Ingen kommentar</Detail>}
            <Button variant={'primary'} size={'small'} onClick={rediger}>
                Rediger
            </Button>
        </VStack>
    );
};
