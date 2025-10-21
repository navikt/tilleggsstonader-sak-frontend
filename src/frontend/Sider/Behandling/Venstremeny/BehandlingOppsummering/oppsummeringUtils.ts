import {
    BehandlingFakta,
    BehandlingFaktaTilsynBarn,
} from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import {
    OppsummertVilkår,
    Stønadsvilkår,
} from '../../../../typer/behandling/behandlingOppsummering';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../../utils/fomatering';
import { typeVilkårFaktaTIlTekst } from '../../Stønadsvilkår/DagligReise/typer/regelstrukturDagligReise';
import { vilkårTypeTilTekst } from '../../Vilkårvurdering/tekster';

export const finnNavnFraBarnId = (
    barnId: string | undefined,
    behandlingFakta: BehandlingFaktaTilsynBarn
) => {
    return behandlingFakta.barn.find((barn) => barn.barnId === barnId)?.registergrunnlag.navn;
};

export const finnTittelForStønadsvilkår = (
    vilkår: Stønadsvilkår,
    behandlingFakta: BehandlingFakta
) => {
    return vilkår.barnId
        ? finnNavnFraBarnId(vilkår.barnId, behandlingFakta as BehandlingFaktaTilsynBarn)
        : vilkårTypeTilTekst[vilkår.type];
};

export const finnGjelderForOppsummertVilkår = (
    stønadstype: Stønadstype,
    vilkår: OppsummertVilkår
): string => {
    switch (stønadstype) {
        case Stønadstype.BARNETILSYN:
        case Stønadstype.BOUTGIFTER:
            return `${formaterTallMedTusenSkilleEllerStrek(vilkår.utgift)} kr`;

        case Stønadstype.DAGLIG_REISE_TSO:
        case Stønadstype.DAGLIG_REISE_TSR:
            return finnGjelderForDagligReise(vilkår);

        case Stønadstype.LÆREMIDLER:
            return '';
    }
};

const finnGjelderForDagligReise = (vilkår: OppsummertVilkår): string =>
    vilkår.typeFakta ? typeVilkårFaktaTIlTekst[vilkår.typeFakta] : '';
