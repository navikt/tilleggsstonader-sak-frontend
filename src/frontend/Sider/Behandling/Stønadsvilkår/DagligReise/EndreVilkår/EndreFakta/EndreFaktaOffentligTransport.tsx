import React from 'react';

import { HStack, TextField } from '@navikt/ds-react';

import { FeilmeldingMaksBredde } from '../../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { harTallverdi, tilHeltall } from '../../../../../../utils/tall';
import { fjernSpaces } from '../../../../../../utils/utils';
import { FaktaOffentligTransport } from '../../typer/faktaDagligReise';
import { FeilmeldingerDagligReise } from '../validering';

interface Props {
    fakta: FaktaOffentligTransport | undefined;
    oppdaterFakta: (key: keyof FaktaOffentligTransport, verdi: number | undefined) => void;
    feilmeldinger: FeilmeldingerDagligReise;
}

export const EndreFaktaOffentligTransport: React.FC<Props> = ({
    fakta,
    oppdaterFakta,
    feilmeldinger,
}) => {
    return (
        <HStack gap="4" align="start">
            <FeilmeldingMaksBredde $maxWidth={180}>
                <TextField
                    label={'Reisedager pr uke'}
                    size="small"
                    error={feilmeldinger.fakta?.reisedagerPerUke}
                    value={harTallverdi(fakta?.reisedagerPerUke) ? fakta?.reisedagerPerUke : ''}
                    onChange={(e) => {
                        oppdaterFakta('reisedagerPerUke', tilHeltall(fjernSpaces(e.target.value)));
                    }}
                />
            </FeilmeldingMaksBredde>
            <FeilmeldingMaksBredde $maxWidth={180}>
                <TextField
                    label={'Pris enkeltbillett'}
                    size="small"
                    error={feilmeldinger.fakta?.enkeltbillett}
                    value={harTallverdi(fakta?.prisEnkelbillett) ? fakta.prisEnkelbillett : ''}
                    onChange={(e) => {
                        oppdaterFakta('prisEnkelbillett', tilHeltall(fjernSpaces(e.target.value)));
                    }}
                />
            </FeilmeldingMaksBredde>
            <FeilmeldingMaksBredde $maxWidth={180}>
                <TextField
                    label={'Pris 7-dagersbillett'}
                    size="small"
                    error={feilmeldinger.fakta?.syvdagersbillett}
                    value={
                        harTallverdi(fakta?.prisSyvdagersbillett) ? fakta?.prisSyvdagersbillett : ''
                    }
                    onChange={(e) => {
                        oppdaterFakta(
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
                    error={feilmeldinger.fakta?.trettidagersbillett}
                    value={
                        harTallverdi(fakta?.prisTrettidagersbillett)
                            ? fakta?.prisTrettidagersbillett
                            : ''
                    }
                    onChange={(e) => {
                        oppdaterFakta(
                            'prisTrettidagersbillett',
                            tilHeltall(fjernSpaces(e.target.value))
                        );
                    }}
                />
            </FeilmeldingMaksBredde>
        </HStack>
    );
};
