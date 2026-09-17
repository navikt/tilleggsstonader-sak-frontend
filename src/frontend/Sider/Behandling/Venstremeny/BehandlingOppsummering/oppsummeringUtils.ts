import {
    BehandlingFakta,
    BehandlingFaktaPassAvBarn,
} from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import {
    OppsummertVilkår,
    Stønadsvilkår,
    TypeVilkårFakta,
} from '../../../../typer/behandling/behandlingOppsummering';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../../utils/fomatering';
import { vilkårTypeTilTekst } from '../../Vilkårvurdering/tekster';

export const finnNavnFraBarnId = (
    barnId: string | undefined,
    behandlingFakta: BehandlingFaktaPassAvBarn
) => {
    return behandlingFakta.barn.find((barn) => barn.barnId === barnId)?.registergrunnlag.navn;
};

export const finnTittelForStønadsvilkår = (
    vilkår: Stønadsvilkår,
    behandlingFakta: BehandlingFakta
) => {
    return vilkår.barnId
        ? finnNavnFraBarnId(vilkår.barnId, behandlingFakta as BehandlingFaktaPassAvBarn)
        : vilkårTypeTilTekst[vilkår.type];
};

export const finnTekstForTypeVilkårFakta = (typeFakta?: TypeVilkårFakta): string => {
    if (!typeFakta) {
        return '';
    }
    if (typeFakta.endsWith('OFFENTLIG_TRANSPORT')) {
        return 'Offentlig transport';
    }
    if (typeFakta.endsWith('PRIVAT_BIL')) {
        return 'Privat bil';
    }
    if (typeFakta.endsWith('TAXI')) {
        return 'Taxi';
    }
    return '';
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
        case Stønadstype.REISE_TIL_SAMLING_TSO:
        case Stønadstype.REISE_TIL_SAMLING_TSR:
        case Stønadstype.REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO:
        case Stønadstype.REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR:
            return finnTekstForTypeVilkårFakta(vilkår.typeFakta);

        case Stønadstype.LÆREMIDLER:
        case Stønadstype.FLYTTING_TSO:
        case Stønadstype.FLYTTING_TSR:
            return '';
    }
};
