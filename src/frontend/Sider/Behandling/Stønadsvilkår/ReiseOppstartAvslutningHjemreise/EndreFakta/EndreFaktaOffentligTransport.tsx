import React from 'react';

import { VStack, HStack } from '@navikt/ds-react';

import TextField from '../../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { harTallverdi, tilHeltall } from '../../../../../utils/tall';
import { fjernSpaces } from '../../../../../utils/utils';
import { Aktivitet } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
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
    aktivitet: Aktivitet;
}> = ({ fakta, nullstillFeilOgUlagretkomponent, settFakta, feilmeldinger, aktivitet }) => {
    const oppdaterFakta = (key: keyof FaktaOffentligTransport, verdi: number | undefined) => {
        settFakta((prevState) => ({
            ...(prevState.type === 'OFFENTLIG_TRANSPORT'
                ? prevState
                : tomtOffentligTransport(aktivitet)),
            [key]: verdi,
        }));

        nullstillFeilOgUlagretkomponent();
    };

    return (
        <VStack gap="space-16">
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
