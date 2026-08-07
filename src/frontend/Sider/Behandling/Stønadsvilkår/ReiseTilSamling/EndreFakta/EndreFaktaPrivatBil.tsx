import React from 'react';

import { VStack, HStack } from '@navikt/ds-react';

import TextField from '../../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { harTallverdi, tilTallverdi } from '../../../../../utils/tall';
import { fjernSpaces } from '../../../../../utils/utils';
import { tomtPrivatBil } from '../EndreVilkår/utils';
import { FeilmeldingerFaktaPrivatBil } from '../EndreVilkår/validering';
import { FaktaPrivatBil, FaktaReiseTilSamling } from '../typer/faktaReiseTilSamling';

export const EndreFaktaPrivatBil: React.FC<{
    fakta: FaktaPrivatBil;
    settFakta: React.Dispatch<React.SetStateAction<FaktaReiseTilSamling>>;
    nullstillFeilOgUlagretkomponent: () => void;
    feilmeldinger: FeilmeldingerFaktaPrivatBil | undefined;
}> = ({ fakta, nullstillFeilOgUlagretkomponent, settFakta, feilmeldinger }) => {
    const oppdaterFakta = (key: keyof FaktaPrivatBil, verdi: number | string | undefined) => {
        settFakta((prevState) => ({
            ...(prevState.type === 'PRIVAT_BIL' ? prevState : tomtPrivatBil),
            [key]: verdi,
        }));

        nullstillFeilOgUlagretkomponent();
    };
    return (
        <VStack gap="space-16">
            <HStack gap="space-16" align="start">
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Totalt reiseavstand i km'}
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
            </HStack>
        </VStack>
    );
};
