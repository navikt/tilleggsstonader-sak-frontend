import React from 'react';

import { styled } from 'styled-components';

import { BgDefault } from '@navikt/ds-tokens/darkside-js';

import { OppsummertVilkårsvurdering } from './OppsummertVilkårsvurdering';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { Statusbånd } from '../../../../../komponenter/Statusbånd';
import { BehandlingType } from '../../../../../typer/behandling/behandlingType';
import { Aktivitet } from '../../typer/vilkårperiode/aktivitet';
import { Målgruppe } from '../../typer/vilkårperiode/målgruppe';

const Container = styled.div`
    position: relative;
    background-color: ${BgDefault};
    padding: 1rem;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
`;

const HovedinnholdContainer = styled.div`
    display: grid;
    grid-template-columns: auto 32px 230px;
    gap: 1rem;
    align-items: start;

    .oppsummering {
        grid-column: 3;
    }
`;

const VenstreKolonne = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const VilkårperiodeKortBase: React.FC<{
    vilkårperiode?: Målgruppe | Aktivitet;
    redigeringKnapp?: React.ReactNode;
    children: React.ReactNode;
    redigeres?: boolean;
    footer?: React.ReactNode;
}> = ({ vilkårperiode, redigeringKnapp, children, redigeres = false, footer }) => {
    const { behandling } = useBehandling();

    const skalViseStatus =
        behandling.type === BehandlingType.REVURDERING && vilkårperiode !== undefined;

    return (
        <Container>
            {skalViseStatus && <Statusbånd status={vilkårperiode.status} />}
            <HovedinnholdContainer>
                <VenstreKolonne>{children}</VenstreKolonne>
                {redigeringKnapp}
                <OppsummertVilkårsvurdering
                    redigeres={redigeres}
                    vilkårperiode={vilkårperiode}
                    className="oppsummering"
                />
            </HovedinnholdContainer>
            {footer}
        </Container>
    );
};

export default VilkårperiodeKortBase;
