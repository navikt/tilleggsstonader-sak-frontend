import React from 'react';

import styled from 'styled-components';

import { BodyShort, ExpansionCard, HStack, VStack } from '@navikt/ds-react';

import { OppsummeringVedtak } from './OppsummeringVedtak';
import { useBehandling } from '../../../context/BehandlingContext';
import { BehandlingStatus } from '../../../typer/behandling/behandlingStatus';
import { Steg } from '../../../typer/behandling/steg';
import { formaterIsoDato } from '../../../utils/dato';
import { OppsummeringGruppe } from '../OppsummeringVilkår/OppsummeringGruppe';
import { OppsummeringVilkår } from '../OppsummeringVilkår/OppsummeringVilkår';
import { OppsummeringVilkårperioder } from '../OppsummeringVilkår/OppsummeringVilkårperioder';

const OppsummeringMedBorder = styled(VStack)`
    padding-right: 4rem;
    border-right: solid 1px white;
`;

const StyledExpansionCard = styled(ExpansionCard)`
    max-width: inherit;
`;

export const Behandlingsoppsummering = ({ steg }: { steg: Steg }) => {
    const { behandling } = useBehandling();
    if (behandling.status === BehandlingStatus.FERDIGSTILT) {
        return null;
    }
    return (
        <StyledExpansionCard aria-labelledby={'Oppsummering behandling'} size={'small'}>
            <ExpansionCard.Header>
                <ExpansionCard.Title size="small">Oppsummering behandling</ExpansionCard.Title>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                <Oppsummering steg={steg} />
            </ExpansionCard.Content>
        </StyledExpansionCard>
    );
};

const Oppsummering = ({ steg }: { steg: Steg }): React.ReactNode => {
    switch (steg) {
        case Steg.INNGANGSVILKÅR:
            return (
                <VStack gap={'4'}>
                    <Behandlingsinformasjon />
                </VStack>
            );
        case Steg.VILKÅR:
            return (
                <VStack gap={'4'}>
                    <Behandlingsinformasjon />
                    <OppsummeringVilkårperioder />
                </VStack>
            );
        case Steg.BEREGNE_YTELSE:
            return (
                <VStack gap={'4'}>
                    <Behandlingsinformasjon />
                    <OppsummeringVilkårperioder />
                    <OppsummeringVilkår />
                </VStack>
            );
        case Steg.SEND_TIL_BESLUTTER:
            return (
                <HStack gap={'16'}>
                    <OppsummeringMedBorder gap={'4'}>
                        <Behandlingsinformasjon />
                        <OppsummeringVilkårperioder />
                        <OppsummeringVilkår />
                    </OppsummeringMedBorder>
                    <OppsummeringVedtak />
                </HStack>
            );
        default:
            return <></>;
    }
};

const Behandlingsinformasjon = () => {
    const { behandling } = useBehandling();
    const { revurderFra } = behandling;
    return (
        revurderFra && (
            <OppsummeringGruppe tittel={'Revurder fra'}>
                <BodyShort size={'small'}>{formaterIsoDato(revurderFra)}</BodyShort>
            </OppsummeringGruppe>
        )
    );
};
