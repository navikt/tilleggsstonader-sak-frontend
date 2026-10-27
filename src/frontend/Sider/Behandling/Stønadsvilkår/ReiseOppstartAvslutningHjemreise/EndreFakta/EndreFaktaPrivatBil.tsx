import React from 'react';

import { VStack, HStack } from '@navikt/ds-react';

import { Skillelinje } from '../../../../../komponenter/Skillelinje';
import TextField from '../../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { NødvendigUtgift } from '../../../../../typer/nødvendigUtgift';
import { harTallverdi, tilTallverdi } from '../../../../../utils/tall';
import { fjernSpaces } from '../../../../../utils/utils';
import { NødvendigUtgiftFelt } from '../../Felles/EndreFakta/NødvendigUtgiftFelt';
import { SpesifikasjonAvUtgift } from '../../ReiseTilSamling/EndreFakta/SpesifikasjonAvUtgift';
import { tomtPrivatBil } from '../EndreVilkår/utils';
import { FeilmeldingerFaktaPrivatBil } from '../EndreVilkår/validering';
import {
    FaktaPrivatBil,
    FaktaReiseOppstartAvslutningHjemreise,
} from '../typer/faktaReiseOppstartAvslutningHjemreise';

/**
 * Aktiviteten som vilkåret gjelder er fastsatt av hvilken aktivitetsgruppe brukeren la til reisen under
 * (se StønadsvilkårReiseOppstartAvslutningHjemreise), og lagres direkte i fakta – den skal ikke velges her.
 */
export const EndreFaktaPrivatBil: React.FC<{
    fakta: FaktaPrivatBil;
    settFakta: React.Dispatch<React.SetStateAction<FaktaReiseOppstartAvslutningHjemreise>>;
    nullstillFeilOgUlagretkomponent: () => void;
    feilmeldinger: FeilmeldingerFaktaPrivatBil | undefined;
}> = ({ fakta, nullstillFeilOgUlagretkomponent, settFakta, feilmeldinger }) => {
    const oppdaterFakta = (
        key: keyof FaktaPrivatBil,
        verdi: number | string | NødvendigUtgift | undefined
    ) => {
        settFakta((prevState) => ({
            ...(prevState.type === 'PRIVAT_BIL' ? prevState : tomtPrivatBil()),
            [key]: verdi,
        }));

        nullstillFeilOgUlagretkomponent();
    };

    return (
        <VStack gap="space-16">
            <NødvendigUtgiftFelt
                nødvendigUtgift={fakta.nødvendigUtgift}
                feilNødvendigUtgift={feilmeldinger?.nødvendigUtgift}
                feilBegrunnelse={feilmeldinger?.begrunnelseNødvendigUtgift}
                beskrivelse="Vurder om den oppgitte utgiften er på et rimelig nivå for å få gjennomført reisen."
                oppdaterFakta={(nødvendigUtgift) =>
                    oppdaterFakta('nødvendigUtgift', nødvendigUtgift)
                }
            />
            <Skillelinje />
            <FeilmeldingMaksBredde $maxWidth={300}>
                <SpesifikasjonAvUtgift
                    value={fakta.begrunnelse || ''}
                    error={feilmeldinger?.spesifikasjonAvUtgift}
                    onChange={(value) => oppdaterFakta('begrunnelse', value || undefined)}
                    pakrevd={false}
                />
            </FeilmeldingMaksBredde>
            <HStack gap="space-16" align="start">
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label="Samlet kjøreavstand tur/retur i km"
                        size="small"
                        error={feilmeldinger?.reiseavstand}
                        value={harTallverdi(fakta.reiseavstand) ? fakta.reiseavstand : ''}
                        onChange={(e) => {
                            oppdaterFakta(
                                'reiseavstand',
                                tilTallverdi(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Bompenger'}
                        size="small"
                        error={feilmeldinger?.bompenger}
                        value={harTallverdi(fakta.bompenger) ? fakta.bompenger : ''}
                        onChange={(e) => {
                            oppdaterFakta('bompenger', tilTallverdi(fjernSpaces(e.target.value)));
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Fergekostnad'}
                        size="small"
                        error={feilmeldinger?.fergekostnad}
                        value={harTallverdi(fakta.fergekostnad) ? fakta.fergekostnad : ''}
                        onChange={(e) => {
                            oppdaterFakta(
                                'fergekostnad',
                                tilTallverdi(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Parkering'}
                        size="small"
                        error={feilmeldinger?.parkering}
                        value={harTallverdi(fakta.parkering) ? fakta.parkering : ''}
                        onChange={(e) => {
                            oppdaterFakta('parkering', tilTallverdi(fjernSpaces(e.target.value)));
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Piggdekkavgift'}
                        size="small"
                        error={feilmeldinger?.piggdekkavgift}
                        value={harTallverdi(fakta.piggdekkavgift) ? fakta.piggdekkavgift : ''}
                        onChange={(e) => {
                            oppdaterFakta(
                                'piggdekkavgift',
                                tilTallverdi(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
            </HStack>
        </VStack>
    );
};
