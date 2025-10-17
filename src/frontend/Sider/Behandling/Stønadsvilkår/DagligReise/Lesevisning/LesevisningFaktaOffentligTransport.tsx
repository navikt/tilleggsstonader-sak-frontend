import React, { FC } from 'react';

import { Alert, BodyShort, HStack } from '@navikt/ds-react';

import { formaterTallMedTusenSkilleEllerStrek } from '../../../../../utils/fomatering';
import { FaktaDagligReise, FaktaOffentligTransport } from '../typer/faktaDagligReise';
import { typeDagligReiseTilTekst } from '../typer/vilkårDagligReise';

export const LesevisningFaktaDagligReise: FC<{
    fakta: FaktaDagligReise | undefined;
}> = ({ fakta }) => {
    if (!fakta) return null;

    switch (fakta.type) {
        case 'OFFENTLIG_TRANSPORT':
            return <LesevisningFaktaOffentligTransport fakta={fakta as FaktaOffentligTransport} />;

        default:
            return (
                <Alert variant="info" size="small" inline>
                    Lesevisning for {typeDagligReiseTilTekst[fakta.type]} er ikke implementert enda
                </Alert>
            );
    }
};

const LesevisningFaktaOffentligTransport: FC<{
    fakta: FaktaOffentligTransport;
}> = ({ fakta }) => {
    return (
        <>
            <HStack gap={'4'} justify={'space-between'}>
                <BodyShort weight="semibold" size="small">
                    {'Reisedager pr uke'}
                </BodyShort>
                <BodyShort size="small">
                    {fakta?.reisedagerPerUke ? `${fakta.reisedagerPerUke}` : '-'}
                </BodyShort>
            </HStack>

            <HStack gap={'4'} justify={'space-between'}>
                <BodyShort weight="semibold" size="small">
                    {'Pris enkeltbillett'}
                </BodyShort>
                <BodyShort size="small">
                    {fakta?.prisEnkelbillett
                        ? `${formaterTallMedTusenSkilleEllerStrek(fakta.prisEnkelbillett)} kr`
                        : '-'}
                </BodyShort>
            </HStack>

            <HStack gap={'4'} justify={'space-between'}>
                <BodyShort weight="semibold" size="small">
                    {'Pris 7 dagers billett'}
                </BodyShort>
                <BodyShort size="small">
                    {fakta?.prisSyvdagersbillett
                        ? `${formaterTallMedTusenSkilleEllerStrek(fakta?.prisSyvdagersbillett)} kr`
                        : '-'}
                </BodyShort>
            </HStack>

            <HStack gap={'4'} justify={'space-between'}>
                <BodyShort weight="semibold" size="small">
                    {'Pris 30 dagers billett'}
                </BodyShort>
                <BodyShort size="small">
                    {fakta?.prisTrettidagersbillett
                        ? `${formaterTallMedTusenSkilleEllerStrek(fakta.prisTrettidagersbillett)} kr`
                        : '-'}
                </BodyShort>
            </HStack>
        </>
    );
};
