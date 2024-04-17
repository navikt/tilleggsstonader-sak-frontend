import React from 'react';

import { styled } from 'styled-components';

import { CircleBrokenIcon } from '@navikt/aksel-icons';
import { HStack, Label } from '@navikt/ds-react';
import { AGray200 } from '@navikt/ds-tokens/dist/tokens';

import { VilkårperiodeResultatTilTekst } from './tekstmapping';
import { VilkårsresultatIkon } from '../../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { VilkårPeriodeResultat } from '../../typer/vilkårperiode';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 200px;
    border-left: 3px solid ${AGray200};
    padding-left: 1rem;
`;

const OppsummertVilkårsvurdering: React.FC<{
    resultat?: VilkårPeriodeResultat;
    redigeres: boolean;
    className?: string;
}> = ({ resultat, redigeres, className }) => {
    return (
        <Container className={className}>
            {redigeres || !resultat ? (
                <HStack wrap={false} gap="4">
                    <span>
                        <CircleBrokenIcon />
                    </span>
                    <Label size="small">Oppsummert vilkårsvurdering vises når du lagrer</Label>
                </HStack>
            ) : (
                <>
                    <HStack align="center" gap="4">
                        <VilkårsresultatIkon vilkårsresultat={resultat} />
                        <Label size="small">{VilkårperiodeResultatTilTekst[resultat]}</Label>
                    </HStack>
                    {/* TODO: Oppsummering av vilkårsvurdering */}
                    {/* Ikke vurdert - list opp vurdering hvor svar mangler, ikke oppfylt - alle som ikke er oppfylt */}
                </>
            )}
        </Container>
    );
};

export default OppsummertVilkårsvurdering;
