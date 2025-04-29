import React from 'react';

import { BodyShort, Label, VStack } from '@navikt/ds-react';

import { VilkårOppsummeringRad } from './OppsummeringRad';
import { finnNavnFraBarnId } from './oppsummeringUtils';
import { useBehandling } from '../../../../context/BehandlingContext';
import { BehandlingFaktaTilsynBarn } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { Stønadsvilkår } from '../../../../typer/behandling/behandlingOppsummering';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../../utils/fomatering';
import { faneNavnStønadsvilkår } from '../../faner';

export const OppsummeringVilkår: React.FC<{
    vilkår: Stønadsvilkår[];
    stønadstype: Stønadstype;
}> = ({ vilkår, stønadstype }) => {
    const { behandlingFakta } = useBehandling();

    if (!vilkår.length && stønadstype !== Stønadstype.LÆREMIDLER) {
        return (
            <VStack gap="2">
                <Label size="small">{faneNavnStønadsvilkår[stønadstype]}</Label>
                <BodyShort size={'small'}>Ingen vilkår registrert</BodyShort>
            </VStack>
        );
    }

    return vilkår.map((etVilkår, indeks) => {
        const tittel = etVilkår.barnId
            ? finnNavnFraBarnId(etVilkår.barnId, behandlingFakta as BehandlingFaktaTilsynBarn)
            : etVilkår.type;

        return (
            <VStack gap="2" key={indeks}>
                <Label size="small">{tittel}</Label>
                {etVilkår.vilkår.map((vilkår) => (
                    <VilkårOppsummeringRad
                        key={vilkår.id}
                        fom={vilkår.fom}
                        tom={vilkår.tom}
                        resultat={vilkår.resultat}
                        gjelder={`${formaterTallMedTusenSkilleEllerStrek(vilkår.utgift)} kr`}
                    />
                ))}
            </VStack>
        );
    });
};
