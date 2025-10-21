import React from 'react';

import { HStack, TextField } from '@navikt/ds-react';

import { FeilmeldingMaksBredde } from '../../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { harTallverdi, tilHeltall } from '../../../../../../utils/tall';
import { fjernSpaces } from '../../../../../../utils/utils';
import { FaktaDagligReise, FaktaOffentligTransport } from '../../typer/faktaDagligReise';
import { tomtOffentligTransport } from '../utils';

interface Props {
    fakta: FaktaOffentligTransport | undefined;
    settFakta: React.Dispatch<React.SetStateAction<FaktaDagligReise | undefined>>;
}

export const EndreFaktaOffentligTransport: React.FC<Props> = ({ fakta, settFakta }) => {
    const oppdaterFelt = (key: keyof FaktaOffentligTransport, verdi: number | undefined) => {
        settFakta((prevState) => ({
            ...(prevState ?? tomtOffentligTransport),
            [key]: verdi,
        }));
    };

    return (
        <HStack gap="4" align="start">
            <FeilmeldingMaksBredde $maxWidth={180}>
                <TextField
                    label={'Reisedager pr uke'}
                    size="small"
                    // error={feilmeldinger.reisedagerPerUke}
                    value={harTallverdi(fakta?.reisedagerPerUke) ? fakta?.reisedagerPerUke : ''}
                    onChange={(e) => {
                        oppdaterFelt('reisedagerPerUke', tilHeltall(fjernSpaces(e.target.value)));
                    }}
                />
            </FeilmeldingMaksBredde>
            <FeilmeldingMaksBredde $maxWidth={180}>
                <TextField
                    label={'Pris enkeltbillett'}
                    size="small"
                    value={harTallverdi(fakta?.prisEnkelbillett) ? fakta.prisEnkelbillett : ''}
                    onChange={(e) => {
                        oppdaterFelt('prisEnkelbillett', tilHeltall(fjernSpaces(e.target.value)));
                    }}
                />
            </FeilmeldingMaksBredde>
            <FeilmeldingMaksBredde $maxWidth={180}>
                <TextField
                    label={'Pris 7-dagersbillett'}
                    size="small"
                    value={
                        harTallverdi(fakta?.prisSyvdagersbillett) ? fakta?.prisSyvdagersbillett : ''
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
                        harTallverdi(fakta?.prisTrettidagersbillett)
                            ? fakta?.prisTrettidagersbillett
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
    );
};
