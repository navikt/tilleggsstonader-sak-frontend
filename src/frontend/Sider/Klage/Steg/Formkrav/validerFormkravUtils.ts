import { FormkravFristUnntak, IFormkravVilkår, Redigeringsmodus, VilkårStatus } from './typer';
import { utledRadioKnapper } from './utils';
import { harVerdi } from '../../../../utils/utils';
import { PåklagetVedtakstype } from '../../typer/klagebehandling/påklagetVedtakstype';

export const alleVurderingerErStatus = (
    formkravVurdering: IFormkravVilkår,
    status: VilkårStatus
): boolean => {
    const { klagePart, klageKonkret, klagefristOverholdt, klageSignert } = formkravVurdering;
    return (
        klagePart === status &&
        klageKonkret === status &&
        klagefristOverholdt === status &&
        klageSignert === status
    );
};

export const påKlagetVedtakValgt = (vurderinger: IFormkravVilkår) => {
    const valgtVedtakstype = vurderinger.påklagetVedtak.påklagetVedtakstype;
    return valgtVedtakstype !== PåklagetVedtakstype.IKKE_VALGT;
};

export const alleVilkårOppfylt = (vurderinger: IFormkravVilkår) => {
    return (
        alleVurderingerErStatus(vurderinger, VilkårStatus.OPPFYLT) ||
        (alleVurderingerOppfyltUntattKlagefrist(vurderinger) &&
            klagefristUnntakErValgtOgOppfylt(vurderinger.klagefristOverholdtUnntak))
    );
};

export const alleVurderingerOppfyltUntattKlagefrist = (formkrav: IFormkravVilkår) => {
    const { klagePart, klageKonkret, klagefristOverholdt, klageSignert } = formkrav;
    return (
        klagePart === VilkårStatus.OPPFYLT &&
        klageKonkret === VilkårStatus.OPPFYLT &&
        klageSignert === VilkårStatus.OPPFYLT &&
        klagefristOverholdt === VilkårStatus.IKKE_OPPFYLT
    );
};

export const klagefristUnntakErValgtOgOppfylt = (unntak?: FormkravFristUnntak) => {
    return unntak !== undefined && klagefristUnntakOppfylt(unntak);
};

const klagefristUnntakOppfylt = (unntak: FormkravFristUnntak) =>
    unntak !== FormkravFristUnntak.IKKE_UNNTAK && unntak !== FormkravFristUnntak.IKKE_SATT;

export const alleVilkårTattStillingTil = (vurderinger: IFormkravVilkår) =>
    utledIkkeUtfylteVilkår(vurderinger).length === 0 &&
    klagefristUnntakTattStillingTil(vurderinger);

export const klagefristUnntakTattStillingTil = (vurderinger: IFormkravVilkår) =>
    vurderinger.klagefristOverholdt === VilkårStatus.OPPFYLT ||
    (vurderinger.klagefristOverholdt === VilkårStatus.IKKE_OPPFYLT &&
        vurderinger.klagefristOverholdtUnntak !== undefined &&
        vurderinger.klagefristOverholdtUnntak !== FormkravFristUnntak.IKKE_SATT);

export const begrunnelseUtfylt = (vurderinger: IFormkravVilkår) => {
    return harVerdi(vurderinger.saksbehandlerBegrunnelse);
};

export const brevtekstUtfylt = (vurderinger: IFormkravVilkår) => {
    return harVerdi(vurderinger.brevtekst);
};

export const utledRedigeringsmodus = (
    behandlingErRedigerbar: boolean,
    vurderinger: IFormkravVilkår
): Redigeringsmodus => {
    if (!behandlingErRedigerbar) {
        return Redigeringsmodus.VISNING;
    }
    if (alleVurderingerErStatus(vurderinger, VilkårStatus.IKKE_SATT)) {
        return Redigeringsmodus.IKKE_PÅSTARTET;
    }
    return Redigeringsmodus.VISNING;
};

export const utledIkkeUtfylteVilkår = (vilkår: IFormkravVilkår) => {
    return utledRadioKnapper(vilkår).filter((valg) => valg.svar === VilkårStatus.IKKE_SATT);
};
