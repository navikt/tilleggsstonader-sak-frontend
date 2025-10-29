import React from 'react';

import { Alert, HStack, TextField, VStack } from '@navikt/ds-react';

import { FeilmeldingMaksBredde } from '../../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { harTallverdi, tilHeltall } from '../../../../../../utils/tall';
import { fjernSpaces } from '../../../../../../utils/utils';
import { FaktaOffentligTransport } from '../../typer/faktaDagligReise';
import { FeilmeldingerFaktaOffentligTransport } from '../validering';

interface Props {
    fakta: FaktaOffentligTransport | undefined;
    oppdaterFakta: (key: keyof FaktaOffentligTransport, verdi: number | undefined) => void;
    feilmeldinger: FeilmeldingerFaktaOffentligTransport | undefined;
}

export const EndreFaktaOffentligTransport: React.FC<Props> = ({
    fakta,
    oppdaterFakta,
    feilmeldinger,
}) => {
    return (
        <VStack gap="4">
            <HStack gap="4" align="start">
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Reisedager pr uke'}
                        size="small"
                        error={feilmeldinger?.reisedagerPerUke}
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
                        label={'Pris enkeltbillett'}
                        size="small"
                        error={feilmeldinger?.enkeltbillett}
                        value={harTallverdi(fakta?.prisEnkelbillett) ? fakta.prisEnkelbillett : ''}
                        onChange={(e) => {
                            oppdaterFakta(
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
                        error={feilmeldinger?.syvdagersbillett}
                        value={
                            harTallverdi(fakta?.prisSyvdagersbillett)
                                ? fakta?.prisSyvdagersbillett
                                : ''
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
                        error={feilmeldinger?.trettidagersbillett}
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
            {feilmeldinger?.felles && (
                <Alert variant="error" size="small">
                    {feilmeldinger.felles}
                </Alert>
            )}
        </VStack>
    );
};
