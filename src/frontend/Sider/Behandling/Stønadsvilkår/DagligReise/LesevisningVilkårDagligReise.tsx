import React, { FC, Fragment } from 'react';

import { styled } from 'styled-components';

import { BusIcon, PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, HGrid, HStack, Label, Tag, VStack } from '@navikt/ds-react';
import { AShadowXsmall } from '@navikt/ds-tokens/dist/tokens';

import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import SmallButton from '../../../../komponenter/Knapper/SmallButton';
import { Skillelinje } from '../../../../komponenter/Skillelinje';
import { FlexColumn } from '../../../../komponenter/Visningskomponenter/Flex';
import { formaterNullablePeriode } from '../../../../utils/dato';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../../utils/fomatering';
import { VilkårsresultatTilTekst } from '../../Inngangsvilkår/Vilkårperioder/VilkårperiodeKort/tekstmapping';
import { Vilkår } from '../../vilkår';
import {
    dagligReiseVilkårTypeTilTekst,
    regelIdTilSpørsmålKortversjon,
    svarIdTilTekstKorversjon,
} from '../../Vilkårvurdering/tekster';

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

const LesevisningVilkårDagligReise: FC<{
    vilkår: Vilkår;
    skalViseRedigeringsknapp?: boolean;
    startRedigering?: () => void;
    vilkårIndex: number;
}> = ({ vilkår, vilkårIndex, startRedigering, skalViseRedigeringsknapp }) => {
    const { resultat, delvilkårsett, fom, tom, offentligTransport, vilkårType } = vilkår;

    return (
        <Container>
            <HGrid gap={{ md: '4', lg: '8' }} columns="minmax(auto, 234px) auto minmax(auto, 64px)">
                <VStack gap="3">
                    <Label size="small">{formaterNullablePeriode(fom, tom)}</Label>
                    <HStack gap="3" align="center">
                        <VilkårsresultatIkon vilkårsresultat={resultat} height={14} width={14} />
                        <BodyShort size="small">{VilkårsresultatTilTekst[resultat]}</BodyShort>
                    </HStack>
                    <HStack gap={'4'} justify={'space-between'}>
                        <BodyShort weight="semibold" size="small">
                            {'Reisedager pr uke'}
                        </BodyShort>
                        <BodyShort size="small">
                            {offentligTransport?.reisedagerPerUke
                                ? `${offentligTransport.reisedagerPerUke}`
                                : '-'}
                        </BodyShort>
                    </HStack>

                    <HStack gap={'4'} justify={'space-between'}>
                        <BodyShort weight="semibold" size="small">
                            {'Pris enkeltbillett'}
                        </BodyShort>
                        <BodyShort size="small">
                            {offentligTransport?.prisEnkelbillett
                                ? `${formaterTallMedTusenSkilleEllerStrek(offentligTransport.prisEnkelbillett)} kr`
                                : '-'}
                        </BodyShort>
                    </HStack>

                    <HStack gap={'4'} justify={'space-between'}>
                        <BodyShort weight="semibold" size="small">
                            {'Pris 7 dagers billett'}
                        </BodyShort>
                        <BodyShort size="small">
                            {offentligTransport?.prisSyvdagersbillett
                                ? `${formaterTallMedTusenSkilleEllerStrek(offentligTransport.prisSyvdagersbillett)} kr`
                                : '-'}
                        </BodyShort>
                    </HStack>

                    <HStack gap={'4'} justify={'space-between'}>
                        <BodyShort weight="semibold" size="small">
                            {'Pris 30 dagers billett'}
                        </BodyShort>
                        <BodyShort size="small">
                            {offentligTransport?.prisTrettidagersbillett
                                ? `${formaterTallMedTusenSkilleEllerStrek(offentligTransport.prisTrettidagersbillett)} kr`
                                : '-'}
                        </BodyShort>
                    </HStack>
                    <Tag style={{ width: 'max-content' }} variant="neutral" icon={<BusIcon />}>
                        {`Reise ${vilkårIndex} med ${dagligReiseVilkårTypeTilTekst[vilkårType]}`}
                    </Tag>
                </VStack>

                <HGrid gap={'1 4'} columns="minmax(100px, max-content) 1fr">
                    {delvilkårsett.map((delvilkår, index) => (
                        <React.Fragment key={index}>
                            <VStack>
                                {delvilkår.vurderinger.map((vurdering, index) => (
                                    <Fragment key={index}>
                                        <HStack gap="3" key={vurdering.regelId}>
                                            <BodyShort weight="semibold" size="small">
                                                {regelIdTilSpørsmålKortversjon[vurdering.regelId]}
                                            </BodyShort>
                                            {vurdering.svar && (
                                                <BodyShort size="small">
                                                    {svarIdTilTekstKorversjon[vurdering.svar]}
                                                </BodyShort>
                                            )}
                                            <BodyShort size="small">
                                                {vurdering.begrunnelse}
                                            </BodyShort>
                                        </HStack>
                                        {delvilkår.vurderinger.length > 1 && (
                                            <Skillelinje style={{ gridColumn: 'span 2' }} />
                                        )}
                                    </Fragment>
                                ))}
                            </VStack>
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
        </Container>
    );
};

export default LesevisningVilkårDagligReise;
