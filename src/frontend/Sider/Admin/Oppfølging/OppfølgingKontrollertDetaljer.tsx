import React from 'react';

import styled from 'styled-components';

import { BodyLong, VStack } from '@navikt/ds-react';

import { Oppfølging, oppfølgingUtfallTilTekst } from './oppfølgingTyper';
import { formaterIsoDatoTid } from '../../../utils/dato';

const Kommentar = styled(BodyLong)`
    white-space: pre-wrap;
`;

export const OppfølgingKontrollertDetaljer = ({
    kontrollert,
}: {
    kontrollert: NonNullable<Oppfølging['kontrollert']>;
}) => {
    return (
        <VStack>
            <span>
                Kontrollert: {formaterIsoDatoTid(kontrollert.tidspunkt)} av{' '}
                {kontrollert.saksbehandler}
            </span>
            <span>Utfall: {oppfølgingUtfallTilTekst[kontrollert.utfall]}</span>
            {kontrollert.kommentar && <Kommentar>Kommentar: {kontrollert.kommentar}</Kommentar>}
            {!kontrollert.kommentar && <span>Ingen kommentar</span>}
        </VStack>
    );
};
