import React, { useEffect } from 'react';

import styled from 'styled-components';

import { BodyShort, ExpansionCard, VStack } from '@navikt/ds-react';

import { OppsummeringAktiviteter, OppsummeringMålgrupper } from './VilkårOppsummeringRad';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useBehandlingOppsummering } from '../../../../hooks/useBehandlingOppsummering';
import DataViewer from '../../../../komponenter/DataViewer';
import { RessursStatus } from '../../../../typer/ressurs';

const StyledExpansionCard = styled(ExpansionCard)`
    margin: 0.5rem;

    .navds-expansioncard__header {
        padding: 0.5rem 1rem;
        align-items: center;
    }
`;

export const BehandlingOppsummering = () => {
    const { behandling } = useBehandling();
    const { behandlingOppsummering, hentBehandlingOppsummering } = useBehandlingOppsummering(
        behandling.id
    );

    useEffect(() => {
        hentBehandlingOppsummering();
    }, [behandling.steg, hentBehandlingOppsummering]);

    if (
        behandlingOppsummering.status === RessursStatus.SUKSESS &&
        !behandlingOppsummering.data.finnesOppsummeringData
    )
        return null;

    return (
        <DataViewer response={{ behandlingOppsummering }}>
            {({ behandlingOppsummering }) => (
                <StyledExpansionCard
                    aria-label="Oppsummering av vurderinger"
                    defaultOpen
                    size="small"
                >
                    <ExpansionCard.Header>Oppsummering av vurderinger</ExpansionCard.Header>
                    <ExpansionCard.Content>
                        <VStack gap="4">
                            {behandling.revurderFra && (
                                <BodyShort size="small">
                                    <b>Revurder fra:</b> {behandling.revurderFra}
                                </BodyShort>
                            )}
                            <OppsummeringAktiviteter
                                aktiviteter={behandlingOppsummering.aktiviteter}
                            />
                            <OppsummeringMålgrupper
                                målgrupper={behandlingOppsummering.målgrupper}
                            />
                        </VStack>
                    </ExpansionCard.Content>
                </StyledExpansionCard>
            )}
        </DataViewer>
    );
};
