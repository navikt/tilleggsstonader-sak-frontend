import React, { FC } from 'react';

import styled from 'styled-components';

import { Alert, BodyShort } from '@navikt/ds-react';

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

const Grid = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    gap: 0.5rem;
    > :nth-child(even) {
        justify-self: end;
    }
`;

const LesevisningFaktaOffentligTransport: FC<{
    fakta: FaktaOffentligTransport;
}> = ({ fakta }) => {
    return (
        <Grid>
            <BodyShort size="small">{'Reisedager pr uke'}</BodyShort>
            <BodyShort size="small">
                {fakta?.reisedagerPerUke ? `${fakta.reisedagerPerUke}` : '-'}
            </BodyShort>

            <BodyShort size="small">{'Pris enkeltbillett'}</BodyShort>
            <BodyShort size="small">
                {fakta?.prisEnkelbillett
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta.prisEnkelbillett)} kr`
                    : '-'}
            </BodyShort>

            <BodyShort size="small">{'Pris 7 dagers billett'}</BodyShort>
            <BodyShort size="small">
                {fakta?.prisSyvdagersbillett
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta?.prisSyvdagersbillett)} kr`
                    : '-'}
            </BodyShort>

            <BodyShort size="small">{'Pris 30 dagers billett'}</BodyShort>
            <BodyShort size="small">
                {fakta?.prisTrettidagersbillett
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta.prisTrettidagersbillett)} kr`
                    : '-'}
            </BodyShort>
        </Grid>
    );
};
