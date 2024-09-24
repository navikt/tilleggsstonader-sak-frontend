import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { styled } from 'styled-components';

import { AWhite } from '@navikt/ds-tokens/dist/tokens';

import OppsummertVilkårsvurdering from './OppsummertVilkårsvurdering';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { Statusbånd } from '../../../../../komponenter/Statusbånd';
import { BehandlingType } from '../../../../../typer/behandling/behandlingType';
import { Toggle } from '../../../../../utils/toggles';
import { Aktivitet } from '../../typer/aktivitet';
import { Målgruppe } from '../../typer/målgruppe';

const Container = styled.div`
    position: relative;
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
    grid-template-columns: 32px 230px;
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
    const { behandling } = useBehandling();
    const toggleErPå = useFlag(Toggle.SKAL_VISE_STATUS_PERIODER);

    const skalViseStatus =
        toggleErPå && behandling.type === BehandlingType.REVURDERING && vilkårperiode !== undefined;

    return (
        <Container>
            {skalViseStatus && <Statusbånd status={vilkårperiode.status} />}
            <VenstreKolonne>{children}</VenstreKolonne>
            <KnappOgOppsummeringContainer>
                {redigeringKnapp}
                <OppsummertVilkårsvurdering
                    redigeres={redigeres}
                    vilkårperiode={vilkårperiode}
                    className="oppsummering"
                />
            </KnappOgOppsummeringContainer>
        </Container>
    );
};

export default VilkårperiodeKortBase;
