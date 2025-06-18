import React from 'react';

import styled from 'styled-components';

import { BodyShort, ExpansionCard, VStack } from '@navikt/ds-react';
import { ABorderDefault, AGray50 } from '@navikt/ds-tokens/dist/tokens';

import { OppsummeringVilkår } from './OppsummeringVilkår';
import { VedtakOppsummering } from './VedtakOppsummering';
import { OppsummeringAktiviteter, OppsummeringMålgrupper } from './VilkårOppsummeringRad';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useBehandlingOppsummering } from '../../../../hooks/useBehandlingOppsummering';
import DataViewer from '../../../../komponenter/DataViewer';
import TilordnetSaksbehandlerCard from '../../../../komponenter/TilordnetSaksbehandler/TilordnetSaksbehandler';
import { RessursStatus } from '../../../../typer/ressurs';
import { formaterDato } from '../../../../utils/dato';

const Container = styled.div`
    background-color: ${AGray50};
    padding: 1rem 0;
    border-bottom: 1px solid ${ABorderDefault};
`;

const StyledExpansionCard = styled(ExpansionCard)`
    margin: 0.5rem;

    .navds-expansioncard__header {
        padding: 0.5rem 1rem;
        align-items: center;
    }
`;

const TilordnetSaksbehandlerContainer = styled.div`
    padding: 0 0 0.5rem 1rem;
`;

export const BehandlingOppsummering = () => {
    const { behandling } = useBehandling();
    const { behandlingOppsummering } = useBehandlingOppsummering();
    if (
        behandlingOppsummering.status === RessursStatus.SUKSESS &&
        !behandlingOppsummering.data.finnesDataÅOppsummere
    ) {
        return null;
    }

    return (
        <DataViewer type={'behandlingsoppsummering'} response={{ behandlingOppsummering }}>
            {({ behandlingOppsummering }) => (
                <Container>
                    <TilordnetSaksbehandlerContainer>
                        <TilordnetSaksbehandlerCard />
                    </TilordnetSaksbehandlerContainer>
                    <StyledExpansionCard
                        aria-label="Oppsummering av vurderinger"
                        defaultOpen
                        size="small"
                    >
                        <ExpansionCard.Header>Oppsummering av vurderinger</ExpansionCard.Header>
                        <ExpansionCard.Content>
                            <VStack gap="6">
                                {behandling.revurderFra && (
                                    <BodyShort size="small">
                                        <b>Revurder fra:</b> {formaterDato(behandling.revurderFra)}
                                    </BodyShort>
                                )}
                                <OppsummeringAktiviteter
                                    aktiviteter={behandlingOppsummering.aktiviteter}
                                />
                                <OppsummeringMålgrupper
                                    målgrupper={behandlingOppsummering.målgrupper}
                                />
                                <OppsummeringVilkår
                                    vilkår={behandlingOppsummering.vilkår}
                                    stønadstype={behandling.stønadstype}
                                />
                                <VedtakOppsummering vedtak={behandlingOppsummering.vedtak} />
                            </VStack>
                        </ExpansionCard.Content>
                    </StyledExpansionCard>
                </Container>
            )}
        </DataViewer>
    );
};
