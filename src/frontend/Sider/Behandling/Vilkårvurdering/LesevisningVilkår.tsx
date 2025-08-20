import React, { FC } from 'react';

import { styled } from 'styled-components';

import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Detail, HGrid, HStack, Label, Tag, VStack } from '@navikt/ds-react';
import { AShadowXsmall } from '@navikt/ds-tokens/dist/tokens';

import LesevisningFremtidigUtgift from './LesevisningFremtidigUtgift';
import { skalFåDekketFaktiskeUtgifter } from './utils';
import { useBehandling } from '../../../context/BehandlingContext';
import { VilkårsresultatIkon } from '../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import { Skillelinje } from '../../../komponenter/Skillelinje';
import { Statusbånd } from '../../../komponenter/Statusbånd';
import { FlexColumn } from '../../../komponenter/Visningskomponenter/Flex';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { formaterNullablePeriode } from '../../../utils/dato';
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

const SlettetKommentar = styled(Detail)`
    white-space: pre-wrap;
`;

const LesevisningVilkår: FC<{
    vilkår: Vilkår;
    skalViseRedigeringsknapp?: boolean;
    startRedigering?: () => void;
}> = ({ vilkår, startRedigering, skalViseRedigeringsknapp }) => {
    const { behandling } = useBehandling();

    const { resultat, delvilkårsett, fom, tom, utgift, erFremtidigUtgift } = vilkår;

    const visStatusbånd = behandling.type == BehandlingType.REVURDERING;

    return (
        <Container>
            {visStatusbånd && <Statusbånd status={vilkår.status} />}
            {erFremtidigUtgift ? (
                <LesevisningFremtidigUtgift
                    vilkår={vilkår}
                    skalViseRedigeringsknapp={skalViseRedigeringsknapp}
                    startRedigering={startRedigering}
                />
            ) : (
                <HGrid
                    gap={{ md: '4', lg: '8' }}
                    columns="minmax(auto, 175px) auto minmax(auto, 32px)"
                >
                    <VStack gap="3">
                        <Label size="small">{formaterNullablePeriode(fom, tom)}</Label>
                        <HStack gap="3" align="center">
                            <VilkårsresultatIkon
                                vilkårsresultat={resultat}
                                height={14}
                                width={14}
                            />
                            <BodyShort size="small">{VilkårsresultatTilTekst[resultat]}</BodyShort>
                        </HStack>
                        <BodyShort size="small">
                            {`kr ${formaterTallMedTusenSkilleEllerStrek(utgift)}`}
                        </BodyShort>
                        {skalFåDekketFaktiskeUtgifter(vilkår) && (
                            <Tag variant="alt1" size={'xsmall'} style={{ maxWidth: 'fit-content' }}>
                                Faktiske utgifter
                            </Tag>
                        )}
                    </VStack>
                    <HGrid gap={'1 4'} columns="minmax(100px, max-content) 1fr">
                        {!erFremtidigUtgift &&
                            delvilkårsett.map((delvilkår, index) => (
                                <React.Fragment key={index}>
                                    <Vurderingsrad delvilkår={delvilkår} />
                                    {index !== delvilkårsett.length - 1 && (
                                        <Skillelinje style={{ gridColumn: 'span 2' }} />
                                    )}
                                </React.Fragment>
                            ))}
                    </HGrid>
                    {skalViseRedigeringsknapp && (
                        <Redigeringsknapp
                            variant="tertiary"
                            onClick={startRedigering}
                            icon={<PencilIcon />}
                        />
                    )}
                </HGrid>
            )}
            {/*TODO plassering? Tittel?*/}
            {vilkår.slettetKommentar && (
                <HGrid>
                    <Detail>Kommentar slettet:</Detail>
                    <SlettetKommentar>{vilkår.slettetKommentar}</SlettetKommentar>
                </HGrid>
            )}
        </Container>
    );
};

export default LesevisningVilkår;
