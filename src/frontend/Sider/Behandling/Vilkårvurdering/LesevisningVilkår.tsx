import React, { FC } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { styled } from 'styled-components';

import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, HGrid, HStack, Label, VStack } from '@navikt/ds-react';
import { AShadowXsmall } from '@navikt/ds-tokens/dist/tokens';

import { useBehandling } from '../../../context/BehandlingContext';
import { VilkårsresultatIkon } from '../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import { Skillelinje } from '../../../komponenter/Skillelinje';
import { Statusbånd } from '../../../komponenter/Statusbånd';
import { FlexColumn } from '../../../komponenter/Visningskomponenter/Flex';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { formaterNullablePeriode } from '../../../utils/dato';
import { Toggle } from '../../../utils/toggles';
import { VilkårsresultatTilTekst } from '../Inngangsvilkår/Vilkårperioder/VilkårperiodeKort/tekstmapping';
import { Vilkår } from '../vilkår';
import { Vurderingsrad } from './Vurderingsrad';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../utils/fomatering';

const Container = styled(FlexColumn)`
    position: relative;
    background: white;
    padding: 1rem;
    box-shadow: ${AShadowXsmall};
`;

const Redigeringsknapp = styled(SmallButton)`
    max-height: 24px;
    align-self: end;
`;

const LesevisningVilkår: FC<{
    vilkår: Vilkår;
    skalViseRedigeringsknapp?: boolean;
    startRedigering?: () => void;
}> = ({ vilkår, startRedigering, skalViseRedigeringsknapp }) => {
    const { behandling } = useBehandling();

    const { resultat, delvilkårsett, fom, tom, utgift } = vilkår;

    const skalViseStatus = useFlag(Toggle.SKAL_VISE_STATUS_PERIODER);

    const visStatusbånd = skalViseStatus && behandling.type == BehandlingType.REVURDERING;

    return (
        <Container>
            {visStatusbånd && <Statusbånd status={vilkår.status} />}
            <HGrid gap={{ md: '4', lg: '8' }} columns="minmax(auto, 175px) auto minmax(auto, 32px)">
                <VStack gap="3">
                    <Label size="small">{formaterNullablePeriode(fom, tom)}</Label>
                    <HStack gap="3" align="center">
                        <VilkårsresultatIkon vilkårsresultat={resultat} height={14} width={14} />
                        <BodyShort size="small">{VilkårsresultatTilTekst[resultat]}</BodyShort>
                    </HStack>
                    <BodyShort size="small">
                        kr {formaterTallMedTusenSkilleEllerStrek(utgift)}
                    </BodyShort>
                </VStack>
                <VStack>
                    {delvilkårsett.map((delvilkår, index) => (
                        <React.Fragment key={index}>
                            <Vurderingsrad delvilkår={delvilkår} />
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
            </HGrid>
        </Container>
    );
};

export default LesevisningVilkår;
