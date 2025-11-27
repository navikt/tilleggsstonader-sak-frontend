import React, { useState } from 'react';

import { Button, TextField, VStack } from '@navikt/ds-react';

import styles from './ReiseavstandForm.module.css';
import { KjøreavstandFormFeil, validerKjøreavstandForm } from './ReiseavstandFormUtils';

export const ReiseavstandForm: React.FC<{
    hentKjøreavstand: (fra: string, til: string) => void;
    hentKollektivDetaljer: (fra: string, til: string) => void;
    hentAdresseForslag: (adresse: string) => Promise<string[]>;
    resetGoogleMapsData: () => void;
}> = ({ hentKjøreavstand, resetGoogleMapsData, hentKollektivDetaljer, hentAdresseForslag }) => {
    const [fraAdresse, setFraAdresse] = useState('');
    const [tilAdresse, setTilAdresse] = useState('');

    const [fraForslag, setFraForslag] = useState<string[]>([]);
    const [tilForslag, setTilForslag] = useState<string[]>([]);

    const [formError, setFormError] = useState<Partial<KjøreavstandFormFeil> | undefined>();

    const hentReisedata = () => {
        const valideringsfeil = validerKjøreavstandForm(fraAdresse, tilAdresse);
        if (valideringsfeil) {
            setFormError(valideringsfeil);
        } else {
            hentKjøreavstand(fraAdresse, tilAdresse);
            hentKollektivDetaljer(fraAdresse, tilAdresse);
        }
    };

    const oppdaterFraAdresse = (adresse: string) => {
        resetGoogleMapsData();
        setFormError(undefined);
        setFraAdresse(adresse);
        hentAdresseForslag(adresse).then(setFraForslag);
    };

    const oppdaterTilAdresse = (adresse: string) => {
        resetGoogleMapsData();
        setFormError(undefined);
        setTilAdresse(adresse);
        hentAdresseForslag(adresse).then(setTilForslag);
    };

    return (
        <VStack gap={'8'} align={'start'}>
            <TextField
                className={styles.adresseInput}
                list={'fra-forslag'}
                label={'Startadresse'}
                size="small"
                value={fraAdresse}
                error={formError?.fraAdresseFeil}
                onChange={(e) => {
                    oppdaterFraAdresse(e.target.value);
                }}
            />
            <datalist id={'fra-forslag'}>
                {fraForslag.map((forslag) => (
                    <option value={forslag} key={forslag} />
                ))}
            </datalist>

            <TextField
                className={styles.adresseInput}
                label={'Tiltaksadresse'}
                list={'til-forslag'}
                size="small"
                value={tilAdresse}
                error={formError?.tilAdresseFeil}
                onChange={(e) => {
                    oppdaterTilAdresse(e.target.value);
                }}
            />
            <datalist id={'til-forslag'}>
                {tilForslag.map((forslag) => (
                    <option value={forslag} key={forslag} />
                ))}
            </datalist>

            <Button size={'small'} onClick={hentReisedata}>
                Regn ut reiseavstand
            </Button>
        </VStack>
    );
};
