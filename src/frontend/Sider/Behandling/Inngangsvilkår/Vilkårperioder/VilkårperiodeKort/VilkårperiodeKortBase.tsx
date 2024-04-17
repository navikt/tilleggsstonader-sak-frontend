import React from 'react';

import { styled } from 'styled-components';

import { AWhite } from '@navikt/ds-tokens/dist/tokens';

import OppsummertVilkårsvurdering from './OppsummertVilkårsvurdering';
import { Aktivitet } from '../../typer/aktivitet';
import { Målgruppe } from '../../typer/målgruppe';

const Container = styled.div`
    background-color: ${AWhite};
    padding: 1rem;

    display: flex;
    justify-content: space-between;
    gap: 1rem;
`;

const VenstreKolonne = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const KnappOgOppsummeringContainer = styled.div`
    display: grid;
    grid-template-columns: 32px 200px;
    gap: 1rem;
    align-items: start;

    .oppsummering {
        grid-column: 2;
    }
`;

const VilkårperiodeKortBase: React.FC<{
    vilkårperiode?: Målgruppe | Aktivitet;
    redigeringKnapp?: React.ReactNode;
    children: React.ReactNode;
    redigeres?: boolean;
}> = ({ vilkårperiode, redigeringKnapp, children, redigeres = false }) => {
    return (
        <Container>
            <VenstreKolonne>{children}</VenstreKolonne>
            <KnappOgOppsummeringContainer>
                {redigeringKnapp}
                <OppsummertVilkårsvurdering
                    redigeres={redigeres}
                    resultat={vilkårperiode?.resultat}
                    className="oppsummering"
                />
            </KnappOgOppsummeringContainer>
        </Container>
    );
};

export default VilkårperiodeKortBase;
