import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { BodyShort, HStack, TextField, VStack } from '@navikt/ds-react';

import { FeilmeldingMaksBredde } from '../../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { harTallverdi, tilHeltall } from '../../../../../../utils/tall';
import { Toggle } from '../../../../../../utils/toggles';
import { fjernSpaces } from '../../../../../../utils/utils';
import { FaktaDagligReise, FaktaPrivatBil } from '../../typer/faktaDagligReise';
import { tomtPrivatBil } from '../utils';

interface Props {
    fakta: FaktaPrivatBil;
    //feilmeldinger: FeilmeldingerFaktaPrivatBil | undefined;
    settFakta: React.Dispatch<React.SetStateAction<FaktaDagligReise>>;
    nullstillFeilOgUlagretkomponent: () => void;
}

export const EndreFaktaPrivatBil: React.FC<Props> = ({
    fakta,
    settFakta,
    nullstillFeilOgUlagretkomponent,
}) => {
    const kanBehandlePrivatBil = useFlag(Toggle.KAN_BEHANDLE_PRIVAT_BIL);

    if (!kanBehandlePrivatBil) {
        return (
            <BodyShort size="small">
                Vi jobber med å gjøre det mulig å behandle kjøring med privat bil 🚗.
            </BodyShort>
        );
    }

    const oppdaterFakta = (key: keyof FaktaPrivatBil, verdi: number | undefined) => {
        settFakta((prevState) => ({
            ...(prevState.type === 'PRIVAT_BIL' ? prevState : tomtPrivatBil),
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
                        value={harTallverdi(fakta.reisedagerPerUke) ? fakta.reisedagerPerUke : ''}
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
                        value={harTallverdi(fakta.reiseavstandEnVei) ? fakta.reiseavstandEnVei : ''}
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
                        label={'Bompenger en vei'}
                        size="small"
                        //error={feilmeldinger?.syvdagersbillett}
                        value={harTallverdi(fakta.bompengerEnVei) ? fakta.bompengerEnVei : ''}
                        onChange={(e) => {
                            oppdaterFakta(
                                'bompengerEnVei',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Fergekostnad en vei'}
                        size="small"
                        //error={feilmeldinger?.trettidagersbillett}
                        value={harTallverdi(fakta.fergekostandEnVei) ? fakta.fergekostandEnVei : ''}
                        onChange={(e) => {
                            oppdaterFakta(
                                'fergekostandEnVei',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
            </HStack>
        </VStack>
    );
};
