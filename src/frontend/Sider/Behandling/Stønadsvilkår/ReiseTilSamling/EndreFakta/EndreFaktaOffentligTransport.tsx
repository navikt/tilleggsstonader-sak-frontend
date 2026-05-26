import React from 'react';

import { VStack, HStack } from '@navikt/ds-react';

import TextField from '../../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { harTallverdi, tilHeltall } from '../../../../../utils/tall';
import { fjernSpaces } from '../../../../../utils/utils';
import { tomtOffentligTransport } from '../EndreVilkår/utils';
import { FeilmeldingerFaktaOffentligTransport } from '../EndreVilkår/validering';
import { FaktaOffentligTransport, FaktaReiseTilSamling } from '../typer/faktaReiseTilSamling';

export const EndreFaktaOffentligTransport: React.FC<{
    fakta: FaktaOffentligTransport;
    settFakta: React.Dispatch<React.SetStateAction<FaktaReiseTilSamling>>;
    nullstillFeilOgUlagretkomponent: () => void;
    feilmeldinger: FeilmeldingerFaktaOffentligTransport | undefined;
}> = ({ fakta, nullstillFeilOgUlagretkomponent, settFakta, feilmeldinger }) => {
    const oppdaterFakta = (key: keyof FaktaOffentligTransport, verdi: number | undefined) => {
        settFakta((prevState) => ({
            ...(prevState.type === 'OFFENTLIG_TRANSPORT' ? prevState : tomtOffentligTransport),
            [key]: verdi,
        }));

        nullstillFeilOgUlagretkomponent();
    };
    return (
        <VStack gap="space-16">
            <HStack gap="space-16" align="start">
                <FeilmeldingMaksBredde $maxWidth={180}>
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
