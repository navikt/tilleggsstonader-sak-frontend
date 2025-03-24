import React, { useState } from 'react';

import { Heading, HStack, VStack } from '@navikt/ds-react';

import FasteUtgifterEnBolig from './FasteUtgifterEnBolig';
import FasteUtgifterToBoliger from './FasteUtgifterToBoliger';
import MidlertidigOvernatting from './MidlertidigOvernatting';
import { useVilkår } from '../../../../context/VilkårContext';
import SmallButton from '../../../../komponenter/Knapper/SmallButton';
import { ReglerResponse } from '../../../../typer/regel';
import { StønadsvilkårType, Vilkårsvurdering } from '../../vilkår';

interface StønadsvilkårBoutgifterProps {
    regler: ReglerResponse;
}

const StønadsvilkårBoutgifter = ({ regler }: StønadsvilkårBoutgifterProps) => {
    const { vilkårsvurdering } = useVilkår();
    const [visFastUtgift, settVisFastUtgift] = useState(finnesFasteUtgifter(vilkårsvurdering));
    const [visMidlertidigUtgift, settVisMidlertidigUtgift] = useState(
        finnesMidlertidigOvernatting(vilkårsvurdering)
    );

    return (
        <>
            {visFastUtgift && (
                <>
                    <FasteUtgifterEnBolig
                        vilkårsregler={regler.vilkårsregler.FASTE_UTGIFTER_EN_BOLIG.regler}
                    />
                    <FasteUtgifterToBoliger
                        vilkårsregler={regler.vilkårsregler.FASTE_UTGIFTER_TO_BOLIGER.regler}
                    />
                </>
            )}
            {visMidlertidigUtgift && (
                <MidlertidigOvernatting
                    vilkårsregler={regler.vilkårsregler.MIDLERTIDIG_OVERNATTING.regler}
                />
            )}
            {!(visFastUtgift && visMidlertidigUtgift) && (
                <VStack gap={'2'}>
                    <Heading size={'small'}>Legg til utgiftsperiode:</Heading>
                    <HStack gap={'2'}>
                        {!visFastUtgift && (
                            <SmallButton
                                variant={'secondary'}
                                onClick={() => settVisFastUtgift(true)}
                            >
                                Faste utgifter til bolig
                            </SmallButton>
                        )}
                        {!visMidlertidigUtgift && (
                            <SmallButton
                                variant={'secondary'}
                                onClick={() => settVisMidlertidigUtgift(true)}
                            >
                                Midlertidig overnatting
                            </SmallButton>
                        )}
                    </HStack>
                </VStack>
            )}
        </>
    );
};

const finnesFasteUtgifter = (vilkårsvurdering: Vilkårsvurdering) =>
    vilkårsvurdering.vilkårsett.some(
        (vilkår) =>
            vilkår.vilkårType === StønadsvilkårType.FASTE_UTGIFTER_EN_BOLIG ||
            vilkår.vilkårType === StønadsvilkårType.FASTE_UTGIFTER_TO_BOLIGER
    );

const finnesMidlertidigOvernatting = (vilkårsvurdering: Vilkårsvurdering) =>
    vilkårsvurdering.vilkårsett.some(
        (vilkår) => vilkår.vilkårType === StønadsvilkårType.MIDLERTIDIG_OVERNATTING
    );

export default StønadsvilkårBoutgifter;
