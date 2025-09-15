import React from 'react';

import { Heading, HStack, TextField } from '@navikt/ds-react';

import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { harTallverdi, tilHeltall } from '../../../../utils/tall';
import { fjernSpaces } from '../../../../utils/utils';
import { OffentligTransport, RedigerbareVilkårfelter } from '../../vilkår';
import { tomtOffentligTransport } from '../../Vilkårvurdering/utils';
import { Feilmeldinger } from '../../Vilkårvurdering/validering';

type Props = {
    redigerbareVilkårfelter: RedigerbareVilkårfelter;
    settDetFinnesUlagredeEndringer: (harUlagredeEndringer: boolean) => void;
    settFeilmeldinger: (
        value: ((prevState: Feilmeldinger) => Feilmeldinger) | Feilmeldinger
    ) => void;
    feilmeldinger: Feilmeldinger;
    offentligTransport: OffentligTransport | undefined;
    settOffentligTransport: React.Dispatch<React.SetStateAction<OffentligTransport | undefined>>;
};

export const OffentligTransportSeksjon = ({
    offentligTransport,
    settOffentligTransport,
    settDetFinnesUlagredeEndringer,
    settFeilmeldinger,
}: Props) => {
    const oppdaterFelt = (key: keyof OffentligTransport, verdi: number | undefined) => {
        settOffentligTransport((prevState) => ({
            ...(prevState ?? tomtOffentligTransport),
            [key]: verdi,
        }));
        settFeilmeldinger((prevState) => ({ ...prevState, utgift: undefined }));

        settDetFinnesUlagredeEndringer(true);
    };

    return (
        <>
            <Heading size={'xsmall'}>Daglig reise med offentlig transport</Heading>
            <HStack gap="4" align="start">
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Reisedager pr uke'}
                        size="small"
                        value={
                            harTallverdi(offentligTransport?.reisedagerPerUke)
                                ? offentligTransport?.reisedagerPerUke
                                : ''
                        }
                        onChange={(e) => {
                            oppdaterFelt(
                                'reisedagerPerUke',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Pris enkeltbillett'}
                        size="small"
                        value={
                            harTallverdi(offentligTransport?.prisEnkelbillett)
                                ? offentligTransport.prisEnkelbillett
                                : ''
                        }
                        onChange={(e) => {
                            oppdaterFelt(
                                'prisEnkelbillett',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Pris 7-dagersbillett'}
                        size="small"
                        value={
                            harTallverdi(offentligTransport?.prisSyvdagersbillett)
                                ? offentligTransport?.prisSyvdagersbillett
                                : ''
                        }
                        onChange={(e) => {
                            oppdaterFelt(
                                'prisSyvdagersbillett',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Pris 30-dagersbillett'}
                        size="small"
                        value={
                            harTallverdi(offentligTransport?.prisTrettidagersbillett)
                                ? offentligTransport?.prisTrettidagersbillett
                                : ''
                        }
                        onChange={(e) => {
                            oppdaterFelt(
                                'prisTrettidagersbillett',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
            </HStack>
        </>
    );
};
