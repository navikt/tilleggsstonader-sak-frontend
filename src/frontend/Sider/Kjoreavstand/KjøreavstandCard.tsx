import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, Heading, HStack, TextField } from '@navikt/ds-react';

import { GoogleMapsEmbededIFrame } from './GoogleMapsEmbeded';
import { KjoreavstandResponse } from './KjoreavstandRespons';
import { RuteDto, useHentKjøreavstand } from './useHentkjøreavstand';
import { FeilmeldingMaksBredde } from '../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { RessursStatus } from '../../typer/ressurs';

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    max-width: 1300px;

    .gm-style .place-card a:link .gm-style .default-card a:link,
    .gm-style .directions-card a:link {
        display: none !important;
    }
`;

export const KjøreavstandCard: React.FC = () => {
    const { hentKjøreavstand } = useHentKjøreavstand();
    const [kjoreavstand, setKjoreavstand] = useState<RuteDto | undefined>();

    const [fra, setFra] = useState('Fyrstikkalléen 1');
    const [fraPostkode, setFraPostkode] = useState('0661');
    const [fraPoststed, setFraPoststed] = useState('Oslo');

    const [til, setTil] = useState('Karl Johans gate 1');
    const [tilPostkode, setTilPostkode] = useState('0155');
    const [tilPoststed, setTilPoststed] = useState('Oslo');

    const resetResultat = () => setKjoreavstand(undefined);

    const handleKjøreavstand = () => {
        hentKjøreavstand(
            {
                gate: fra,
                postnummer: fraPostkode,
                poststed: fraPoststed,
            },
            {
                gate: til,
                postnummer: tilPostkode,
                poststed: tilPoststed,
            }
        ).then((it) => {
            if (it.status === RessursStatus.SUKSESS) {
                setKjoreavstand(it.data);
            }
        });
    };

    return (
        <Container>
            <div style={{ justifyContent: 'flex-start' }}>
                <Heading size={'small'}>Startadresse</Heading>
                <HStack gap={'4'} marginBlock={'0 4'}>
                    <FeilmeldingMaksBredde $maxWidth={180}>
                        <TextField
                            label={'Adresse'}
                            size="small"
                            value={fra}
                            onChange={(e) => {
                                setFra(e.target.value);
                                resetResultat();
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
                                resetResultat();
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
                                resetResultat();
                            }}
                        />
                    </FeilmeldingMaksBredde>
                </HStack>

                <Heading size={'small'}>Tiltaksadresse</Heading>
                <HStack gap={'4'} marginBlock={'0 4'}>
                    <FeilmeldingMaksBredde $maxWidth={180}>
                        <TextField
                            label={'Adresse'}
                            size="small"
                            value={til}
                            onChange={(e) => {
                                setTil(e.target.value);
                                resetResultat();
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
                                resetResultat();
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
                                resetResultat();
                            }}
                        />
                    </FeilmeldingMaksBredde>
                </HStack>

                <div style={{ marginTop: '1rem' }}>
                    <Button size={'small'} onClick={handleKjøreavstand}>
                        Regn ut kjøreavstand
                    </Button>
                </div>
                {kjoreavstand?.routes?.map((route, routeIndex) => (
                    <KjoreavstandResponse key={routeIndex} route={route} fra={fra} til={til} />
                ))}
            </div>
            <div>
                <GoogleMapsEmbededIFrame
                    fra={fra}
                    fraPostkode={fraPostkode}
                    fraPoststed={fraPoststed}
                    til={til}
                    tilPostkode={tilPostkode}
                    tilPoststed={tilPoststed}
                />
            </div>
        </Container>
    );
};
