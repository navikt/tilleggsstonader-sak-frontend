import React from 'react';

import { VStack, HStack } from '@navikt/ds-react';

import { Skillelinje } from '../../../../../komponenter/Skillelinje';
import TextField from '../../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { NødvendigUtgift } from '../../../../../typer/nødvendigUtgift';
import { harTallverdi, tilHeltall } from '../../../../../utils/tall';
import { fjernSpaces } from '../../../../../utils/utils';
import { NødvendigUtgiftFelt } from '../../Felles/EndreFakta/NødvendigUtgiftFelt';
import { SpesifikasjonAvUtgift } from '../../ReiseTilSamling/EndreFakta/SpesifikasjonAvUtgift';
import { tomtOffentligTransport } from '../EndreVilkår/utils';
import { FeilmeldingerFaktaOffentligTransport } from '../EndreVilkår/validering';
import {
    FaktaOffentligTransport,
    FaktaReiseOppstartAvslutningHjemreise,
} from '../typer/faktaReiseOppstartAvslutningHjemreise';

/**
 * Aktiviteten som vilkåret gjelder er fastsatt av hvilken aktivitetsgruppe brukeren la til reisen under
 * (se StønadsvilkårReiseOppstartAvslutningHjemreise), og lagres direkte i fakta – den skal ikke velges her.
 */
export const EndreFaktaOffentligTransport: React.FC<{
    fakta: FaktaOffentligTransport;
    settFakta: React.Dispatch<React.SetStateAction<FaktaReiseOppstartAvslutningHjemreise>>;
    nullstillFeilOgUlagretkomponent: () => void;
    feilmeldinger: FeilmeldingerFaktaOffentligTransport | undefined;
}> = ({ fakta, nullstillFeilOgUlagretkomponent, settFakta, feilmeldinger }) => {
    const oppdaterFakta = (
        key: keyof FaktaOffentligTransport,
        verdi: number | string | NødvendigUtgift | undefined
    ) => {
        settFakta((prevState) => ({
            ...(prevState.type === 'OFFENTLIG_TRANSPORT' ? prevState : tomtOffentligTransport()),
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
                    pakrevd={true}
                    beskrivelse="Spesifikasjonen vil komme med i vedtaksbrevet, fatt deg i korthet"
                />
            </FeilmeldingMaksBredde>
            <HStack gap="space-16" align="start">
                <FeilmeldingMaksBredde $maxWidth={220}>
                    <TextField
                        label={'Utgifter til offentlig transport'}
                        size="small"
                        error={feilmeldinger?.utgifterOffentligTransport}
                        value={
                            harTallverdi(fakta.utgifterOffentligTransport)
                                ? fakta.utgifterOffentligTransport
                                : ''
                        }
                        onChange={(e) => {
                            oppdaterFakta(
                                'utgifterOffentligTransport',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
            </HStack>
        </VStack>
    );
};
