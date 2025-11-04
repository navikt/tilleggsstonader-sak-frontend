import React, { FC } from 'react';

import { styled } from 'styled-components';

import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, HGrid, HStack, Label, Tag, VStack } from '@navikt/ds-react';

import LesevisningFremtidigUtgift from './LesevisningFremtidigUtgift';
import { skalFåDekketFaktiskeUtgifter } from './utils';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import { ResultatOgStatusKort } from '../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { Skillelinje } from '../../../komponenter/Skillelinje';
import { formaterNullablePeriode } from '../../../utils/dato';
import { VilkårsresultatTilTekst } from '../Inngangsvilkår/Vilkårperioder/VilkårperiodeKort/tekstmapping';
import { Vilkår } from '../vilkår';
import { Vurderingsrad } from './Vurderingsrad';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../utils/fomatering';

const Redigeringsknapp = styled(SmallButton)`
    max-height: 24px;
    align-self: end;
`;

const LesevisningVilkår: FC<{
    vilkår: Vilkår;
    skalViseRedigeringsknapp?: boolean;
    startRedigering?: () => void;
}> = ({ vilkår, startRedigering, skalViseRedigeringsknapp }) => {
    const { resultat, delvilkårsett, fom, tom, utgift, erFremtidigUtgift } = vilkår;

    return (
        <ResultatOgStatusKort
            periode={vilkår}
            redigeringKnapp={
                skalViseRedigeringsknapp && (
                    <Redigeringsknapp
                        variant="tertiary"
                        onClick={startRedigering}
                        icon={<PencilIcon />}
                    />
                )
            }
        >
            {erFremtidigUtgift ? (
                <LesevisningFremtidigUtgift
                    vilkår={vilkår}
                    skalViseRedigeringsknapp={skalViseRedigeringsknapp}
                    startRedigering={startRedigering}
                />
            ) : (
                <HGrid gap={{ md: '4', lg: '8' }} columns="minmax(auto, 175px) auto">
                    <VStack gap="3">
                        <Label size="small">{formaterNullablePeriode(fom, tom)}</Label>
                        <BodyShort size="small">{VilkårsresultatTilTekst[resultat]}</BodyShort>
                        <BodyShort size="small">
                            {`kr ${formaterTallMedTusenSkilleEllerStrek(utgift)}`}
                        </BodyShort>
                        {skalFåDekketFaktiskeUtgifter(vilkår) && (
                            <Tag variant="alt1" size={'xsmall'} style={{ maxWidth: 'fit-content' }}>
                                Faktiske utgifter
                            </Tag>
                        )}
                    </VStack>
                    <VStack gap="1">
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
                        {vilkår.slettetKommentar && (
                            <>
                                <Skillelinje />
                                <HStack gap="4">
                                    <Label size="small">Kommentar slettet:</Label>
                                    <BodyShort size="small">{vilkår.slettetKommentar}</BodyShort>
                                </HStack>
                            </>
                        )}
                    </VStack>
                </HGrid>
            )}
        </ResultatOgStatusKort>
    );
};

export default LesevisningVilkår;
