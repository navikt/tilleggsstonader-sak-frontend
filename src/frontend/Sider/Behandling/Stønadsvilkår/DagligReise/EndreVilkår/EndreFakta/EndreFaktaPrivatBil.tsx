import React from 'react';

import { HStack, TextField, VStack } from '@navikt/ds-react';

import { FeilmeldingMaksBredde } from '../../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { harTallverdi, tilHeltall } from '../../../../../../utils/tall';
import { fjernSpaces } from '../../../../../../utils/utils';
import { FaktaDagligReise, FaktaPrivatBil } from '../../typer/faktaDagligReise';
import { tomtPrivatBil } from '../utils';

interface Props {
    fakta: FaktaPrivatBil | undefined;
    //feilmeldinger: FeilmeldingerFaktaPrivatBil | undefined;
    settFakta: React.Dispatch<React.SetStateAction<FaktaDagligReise | undefined>>;
    nullstillFeilOgUlagretkomponent: () => void;
}

export const EndreFaktaPrivatBil: React.FC<Props> = ({
    fakta,
    settFakta,
    nullstillFeilOgUlagretkomponent,
}) => {
    const oppdaterFakta = (key: keyof FaktaPrivatBil, verdi: number | undefined) => {
        settFakta((prevState) => ({
            ...(prevState ?? tomtPrivatBil),
            [key]: verdi,
        }));

        nullstillFeilOgUlagretkomponent();
    };

    return (
        <VStack gap="4">
            <HStack gap="4" align="start">
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Reisedager pr uke'}
                        size="small"
                        //error={feilmeldinger?.reisedagerPerUke}
                        value={harTallverdi(fakta?.reisedagerPerUke) ? fakta?.reisedagerPerUke : ''}
                        onChange={(e) => {
                            oppdaterFakta(
                                'reisedagerPerUke',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Reiseavstand en vei (km)'}
                        size="small"
                        //error={feilmeldinger?.enkeltbillett}
                        value={
                            harTallverdi(fakta?.reiseavstandEnVei) ? fakta?.reiseavstandEnVei : ''
                        }
                        onChange={(e) => {
                            oppdaterFakta(
                                'reiseavstandEnVei',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Bompenger per dag'}
                        size="small"
                        //error={feilmeldinger?.syvdagersbillett}
                        value={
                            harTallverdi(fakta?.prisBompengerPerDag)
                                ? fakta?.prisBompengerPerDag
                                : ''
                        }
                        onChange={(e) => {
                            oppdaterFakta(
                                'prisBompengerPerDag',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Fergekostnad per dag'}
                        size="small"
                        //error={feilmeldinger?.trettidagersbillett}
                        value={
                            harTallverdi(fakta?.prisFergekostandPerDag)
                                ? fakta?.prisFergekostandPerDag
                                : ''
                        }
                        onChange={(e) => {
                            oppdaterFakta(
                                'prisFergekostandPerDag',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
            </HStack>
        </VStack>
    );
};
