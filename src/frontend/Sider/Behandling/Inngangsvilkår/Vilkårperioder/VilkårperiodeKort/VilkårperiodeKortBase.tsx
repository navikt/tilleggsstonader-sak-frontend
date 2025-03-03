import React from 'react';

import { styled } from 'styled-components';

import { Tag } from '@navikt/ds-react';
import { AWhite } from '@navikt/ds-tokens/dist/tokens';

import { OppsummertVilkårsvurdering } from './OppsummertVilkårsvurdering';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { Statusbånd } from '../../../../../komponenter/Statusbånd';
import { BehandlingType } from '../../../../../typer/behandling/behandlingType';
import { erAktivitet } from '../../Aktivitet/utilsAktivitet';
import { Aktivitet } from '../../typer/vilkårperiode/aktivitet';
import { Målgruppe } from '../../typer/vilkårperiode/målgruppe';

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

const HøyreKolonne = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: end;
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

    const skalViseStatus =
        behandling.type === BehandlingType.REVURDERING && vilkårperiode !== undefined;

    return (
        <Container>
            {skalViseStatus && <Statusbånd status={vilkårperiode.status} />}
            <VenstreKolonne>{children}</VenstreKolonne>
            <HøyreKolonne>
                <KnappOgOppsummeringContainer>
                    {redigeringKnapp}
                    <OppsummertVilkårsvurdering
                        redigeres={redigeres}
                        vilkårperiode={vilkårperiode}
                        className="oppsummering"
                    />
                </KnappOgOppsummeringContainer>
                {erAktivitet(vilkårperiode) && vilkårperiode.kildeId && (
                    <Tag variant="alt2" size="small">
                        {vilkårperiode.kildeId}
                    </Tag>
                )}
            </HøyreKolonne>
        </Container>
    );
};

export default VilkårperiodeKortBase;
