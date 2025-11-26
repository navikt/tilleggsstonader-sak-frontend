import React, { useState } from 'react';

import { Button, Heading, HStack, TextField, VStack } from '@navikt/ds-react';

import { ReiseAdresse } from './ReisedataRequest';
import { FeilmeldingMaksBredde } from '../../komponenter/Visningskomponenter/FeilmeldingFastBredde';

export const KjøreavstandForm: React.FC<{
    hentKjøreavstand: (fra: ReiseAdresse, til: ReiseAdresse) => void;
    hentKollektivDetaljer: (fra: ReiseAdresse, til: ReiseAdresse) => void;
    resetGoogleMapsData: () => void;
}> = ({ hentKjøreavstand, resetGoogleMapsData, hentKollektivDetaljer }) => {
    const [fra, setFra] = useState('');
    const [fraPostkode, setFraPostkode] = useState('');
    const [fraPoststed, setFraPoststed] = useState('');

    const [til, setTil] = useState('');
    const [tilPostkode, setTilPostkode] = useState('');
    const [tilPoststed, setTilPoststed] = useState('');

    const hentReisedata = () => {
        const fraAdresse = {
            gate: fra,
            postnummer: fraPostkode,
            poststed: fraPoststed,
        };
        const tilAdresse = {
            gate: til,
            postnummer: tilPostkode,
            poststed: tilPoststed,
        };
        hentKjøreavstand(fraAdresse, tilAdresse);
        hentKollektivDetaljer(fraAdresse, tilAdresse);
    };

    return (
        <VStack gap={'8'} align={'start'}>
            <VStack>
                <Heading size={'small'}>Startadresse</Heading>
                <HStack gap={'4'}>
                    <FeilmeldingMaksBredde $maxWidth={180}>
                        <TextField
                            label={'Adresse'}
                            size="small"
                            value={fra}
                            onChange={(e) => {
                                setFra(e.target.value);
                                resetGoogleMapsData();
                            }}
                        />
                    </FeilmeldingMaksBredde>

                    <FeilmeldingMaksBredde $maxWidth={60}>
                        <TextField
                            label={'Postnummer'}
                            size="small"
                            value={fraPostkode}
                            onChange={(e) => {
                                setFraPostkode(e.target.value);
                                resetGoogleMapsData();
                            }}
                        />
                    </FeilmeldingMaksBredde>

                    <FeilmeldingMaksBredde $maxWidth={60}>
                        <TextField
                            label={'Poststed'}
                            size="small"
                            value={fraPoststed}
                            onChange={(e) => {
                                setFraPoststed(e.target.value);
                                resetGoogleMapsData();
                            }}
                        />
                    </FeilmeldingMaksBredde>
                </HStack>
            </VStack>

            <VStack>
                <Heading size={'small'}>Tiltaksadresse</Heading>
                <HStack gap={'4'}>
                    <FeilmeldingMaksBredde $maxWidth={180}>
                        <TextField
                            label={'Adresse'}
                            size="small"
                            value={til}
                            onChange={(e) => {
                                setTil(e.target.value);
                                resetGoogleMapsData();
                            }}
                        />
                    </FeilmeldingMaksBredde>

                    <FeilmeldingMaksBredde $maxWidth={60}>
                        <TextField
                            label={'Postnummer'}
                            size="small"
                            value={tilPostkode}
                            onChange={(e) => {
                                setTilPostkode(e.target.value);
                                resetGoogleMapsData();
                            }}
                        />
                    </FeilmeldingMaksBredde>

                    <FeilmeldingMaksBredde $maxWidth={60}>
                        <TextField
                            label={'Poststed'}
                            size="small"
                            value={tilPoststed}
                            onChange={(e) => {
                                setTilPoststed(e.target.value);
                                resetGoogleMapsData();
                            }}
                        />
                    </FeilmeldingMaksBredde>
                </HStack>
            </VStack>

            <Button size={'small'} onClick={hentReisedata}>
                Regn ut reiseavstand
            </Button>
        </VStack>
    );
};
