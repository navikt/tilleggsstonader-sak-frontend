import React from 'react';

import { BodyShort, Label, VStack } from '@navikt/ds-react';

import { VilkårOppsummeringRad } from './OppsummeringRad';
import { finnTittelForStønadsvilkår } from './oppsummeringUtils';
import { useBehandling } from '../../../../context/BehandlingContext';
import { Stønadsvilkår } from '../../../../typer/behandling/behandlingOppsummering';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../../utils/fomatering';
import { faneNavnStønadsvilkår } from '../../faner';
import { StønadsvilkårType } from '../../vilkår';
import { dagligReiseVilkårTypeTilTekst } from '../../Vilkårvurdering/tekster';

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

    return vilkår.map((etVilkår, indeks) => (
        <VStack gap="2" key={indeks}>
            <Label size="small">{finnTittelForStønadsvilkår(etVilkår, behandlingFakta)}</Label>
            {etVilkår.vilkår.map((vilkår) => (
                <VilkårOppsummeringRad
                    key={vilkår.id}
                    fom={vilkår.fom}
                    tom={vilkår.tom}
                    resultat={vilkår.resultat}
                    gjelder={
                        etVilkår.type === StønadsvilkårType.DAGLIG_REISE_OFFENTLIG_TRANSPORT
                            ? dagligReiseVilkårTypeTilTekst[etVilkår.type]
                            : `${formaterTallMedTusenSkilleEllerStrek(vilkår.utgift)} kr`
                    }
                />
            ))}
        </VStack>
    ));
};
