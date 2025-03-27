import React from 'react';

import LøpendeUtgifterEnBolig from './LøpendeUtgifterEnBolig';
import LøpendeUtgifterToBoliger from './LøpendeUtgifterToBoliger';
import UtgifterOvernatting from './UtgifterOvernatting';
import { ReglerResponse } from '../../../../typer/regel';

interface StønadsvilkårBoutgifterProps {
    regler: ReglerResponse;
}

const StønadsvilkårBoutgifter = ({ regler }: StønadsvilkårBoutgifterProps) => (
    <>
        <LøpendeUtgifterEnBolig
            vilkårsregler={regler.vilkårsregler.LØPENDE_UTGIFTER_EN_BOLIG.regler}
        />
        <LøpendeUtgifterToBoliger
            vilkårsregler={regler.vilkårsregler.LØPENDE_UTGIFTER_TO_BOLIGER.regler}
        />
        <UtgifterOvernatting vilkårsregler={regler.vilkårsregler.UTGIFTER_OVERNATTING.regler} />
    </>
);

export default StønadsvilkårBoutgifter;
