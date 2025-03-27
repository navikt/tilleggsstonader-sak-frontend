import React from 'react';

import FasteUtgifterEnBolig from './FasteUtgifterEnBolig';
import FasteUtgifterToBoliger from './FasteUtgifterToBoliger';
import MidlertidigOvernatting from './MidlertidigOvernatting';
import { ReglerResponse } from '../../../../typer/regel';

interface StønadsvilkårBoutgifterProps {
    regler: ReglerResponse;
}

const StønadsvilkårBoutgifter = ({ regler }: StønadsvilkårBoutgifterProps) => (
    <>
        <FasteUtgifterEnBolig vilkårsregler={regler.vilkårsregler.FASTE_UTGIFTER_EN_BOLIG.regler} />
        <FasteUtgifterToBoliger
            vilkårsregler={regler.vilkårsregler.FASTE_UTGIFTER_TO_BOLIGER.regler}
        />
        <MidlertidigOvernatting
            vilkårsregler={regler.vilkårsregler.MIDLERTIDIG_OVERNATTING.regler}
        />
    </>
);

export default StønadsvilkårBoutgifter;
