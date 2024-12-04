import React, { FC } from 'react';

import { styled } from 'styled-components';

import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, HGrid, HStack, Label, VStack } from '@navikt/ds-react';
import { AGray200, AShadowXsmall } from '@navikt/ds-tokens/dist/tokens';

import { useBehandling } from '../../../context/BehandlingContext';
import { VilkårsresultatIkon } from '../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import { Statusbånd } from '../../../komponenter/Statusbånd';
import { FlexColumn } from '../../../komponenter/Visningskomponenter/Flex';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { formaterNullablePeriode } from '../../../utils/dato';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../utils/fomatering';
import { VilkårsresultatTilTekst } from '../Inngangsvilkår/Vilkårperioder/VilkårperiodeKort/tekstmapping';
import { Vilkår } from '../vilkår';
import { VurderingsradTest } from './VurderingsradTest';
import { Skillelinje } from '../../../komponenter/Skillelinje';

const Container = styled(FlexColumn)`
    position: relative;
    background: white;
    padding: 1rem;
    box-shadow: ${AShadowXsmall};
`;

const Container2 = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-left: 3px solid ${AGray200};
    padding-left: 1rem;
`;

const Redigeringsknapp = styled(SmallButton)`
    max-height: 24px;
    justify-self: flex-end;
    align-self: top-left;
`;

const LesevisningVilkårTest: FC<{
    vilkår: Vilkår;
    skalViseRedigeringsknapp?: boolean;
    startRedigering?: () => void;
}> = ({ vilkår, startRedigering, skalViseRedigeringsknapp }) => {
    const { behandling } = useBehandling();

    const { resultat, delvilkårsett, fom, tom, utgift } = vilkår;

    const visStatusbånd = behandling.type == BehandlingType.REVURDERING;

    return (
        <Container>
            {visStatusbånd && <Statusbånd status={vilkår.status} />}
            <HGrid gap="4" columns="minmax(auto, 175px) auto minmax(auto, 32px) 240px">
                <VStack gap="3">
                    <Label size="small">{formaterNullablePeriode(fom, tom)}</Label>
                    <BodyShort size="small">
                        kr {formaterTallMedTusenSkilleEllerStrek(utgift)}
                    </BodyShort>
                </VStack>
                <VStack>
                    {delvilkårsett.map((delvilkår, index) => (
                        <React.Fragment key={index}>
                            <VurderingsradTest delvilkår={delvilkår} />
                            {index !== delvilkårsett.length - 1 && <Skillelinje />}
                        </React.Fragment>
                    ))}
                </VStack>
                {skalViseRedigeringsknapp && (
                    <Redigeringsknapp
                        variant="tertiary"
                        onClick={startRedigering}
                        icon={<PencilIcon />}
                    />
                )}
                <Container2>
                    <HStack align="center" gap="4">
                        <VilkårsresultatIkon vilkårsresultat={resultat} />
                        <Label size="small">{VilkårsresultatTilTekst[resultat]}</Label>
                    </HStack>
                </Container2>
            </HGrid>
        </Container>
    );
};

export default LesevisningVilkårTest;
