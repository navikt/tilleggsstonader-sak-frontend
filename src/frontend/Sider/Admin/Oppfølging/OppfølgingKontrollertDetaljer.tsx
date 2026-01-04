import React from 'react';

import { BodyShort, Button, Detail, VStack } from '@navikt/ds-react';

import styles from './OppfølgingKontrollertDetaljer.module.css';
import { Oppfølging, oppfølgingUtfallTilTekst } from './oppfølgingTyper';
import { formaterIsoDatoTid } from '../../../utils/dato';

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
            {kontrollert.kommentar && (
                <Detail className={styles.kommentar}>{kontrollert.kommentar}</Detail>
            )}
            {!kontrollert.kommentar && <Detail>Ingen kommentar</Detail>}
            <Button variant={'primary'} size={'small'} onClick={rediger}>
                Rediger
            </Button>
        </VStack>
    );
};
