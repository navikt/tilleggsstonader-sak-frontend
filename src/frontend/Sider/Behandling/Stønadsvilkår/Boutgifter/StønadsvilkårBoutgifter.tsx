import React from 'react';

import FasteUtgifterEnBolig from './FasteUtgifterEnBolig';
import FasteUtgifterToBoliger from './FasteUtgifterToBoliger';
import UtgifterOvernatting from './UtgifterOvernatting';
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
        <UtgifterOvernatting vilkårsregler={regler.vilkårsregler.UTGIFTER_OVERNATTING.regler} />
    </>
);

export default StønadsvilkårBoutgifter;
