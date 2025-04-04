import React from 'react';

import PassBarn from './PassBarn';
import { VarselBarnUnder2År } from './VarselBarnUnder2år';
import { ReglerResponse } from '../../../../typer/regel';
import { Vilkårsoppsummering } from '../../../../typer/vilkårsoppsummering';

export const StønadsvilkårPassBarn = ({
    vilkårsoppsummering,
    regler,
}: {
    regler: ReglerResponse;
    vilkårsoppsummering: Vilkårsoppsummering;
}) => {
    return (
        <>
            {vilkårsoppsummering.visVarselKontantstøtte && <VarselBarnUnder2År />}
            <PassBarn vilkårsregler={regler.vilkårsregler.PASS_BARN.regler} />
        </>
    );
};
