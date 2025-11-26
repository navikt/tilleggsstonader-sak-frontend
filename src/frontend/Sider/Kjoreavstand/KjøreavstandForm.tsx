import React, { useCallback, useState } from 'react';

import { Button, TextField, VStack } from '@navikt/ds-react';

import { ForslagRequest } from './ForslagRequest';
import { ForslagResponse } from './ForslagResponse';
import styles from './KjøreavstandForm.module.css';
import { useApp } from '../../context/AppContext';
import { RessursStatus } from '../../typer/ressurs';

export const KjøreavstandForm: React.FC<{
    hentKjøreavstand: (fra: string, til: string) => void;
    hentKollektivDetaljer: (fra: string, til: string) => void;
    resetGoogleMapsData: () => void;
}> = ({ hentKjøreavstand, resetGoogleMapsData, hentKollektivDetaljer }) => {
    const { request } = useApp();

    const [fraAdresse, setFraAdresse] = useState('');
    const [tilAdresse, setTilAdresse] = useState('');

    const [fraForslag, setFraForslag] = useState<string[]>([]);
    const [tilForslag, setTilForslag] = useState<string[]>([]);

    const hentReisedata = () => {
        hentKjøreavstand(fraAdresse, tilAdresse);
        hentKollektivDetaljer(fraAdresse, tilAdresse);
    };

    const oppdaterFraAdresse = (adresse: string) => {
        resetGoogleMapsData();
        setFraAdresse(adresse);
        hentForslag(adresse).then(setFraForslag);
    };

    const oppdaterTilAdresse = (adresse: string) => {
        resetGoogleMapsData();
        setTilAdresse(adresse);
        hentForslag(adresse).then(setTilForslag);
    };

    const hentForslag = useCallback(
        async (input: string) => {
            const res = await request<ForslagResponse, ForslagRequest>(
                `/api/sak/kart/autocomplete`,
                'POST',
                {
                    input: input,
                }
            );
            if (res.status === RessursStatus.SUKSESS) {
                return res.data.forslag;
            }
            return [];
        },
        [request]
    );
    return (
        <VStack gap={'8'} align={'start'}>
            <TextField
                className={styles.adresseInput}
                list={'fra-forslag'}
                label={'Startadresse'}
                size="small"
                value={fraAdresse}
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
