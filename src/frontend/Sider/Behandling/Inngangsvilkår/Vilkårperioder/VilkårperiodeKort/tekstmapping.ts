import { SvarJaNei, VilkårPeriodeResultat } from '../../typer/vilkårperiode';

export const medlemskapSvarTilTekst: Record<SvarJaNei, string> = {
    [SvarJaNei.JA]: 'Medlemskap i folketrygden',
    [SvarJaNei.JA_IMPLISITT]: 'Medlemskap i folketrygden',
    [SvarJaNei.NEI]: 'Ikke medlemskap i folketrygden',
};

export const dekketAvAnnetRegelverkSvarTilTekst: Record<SvarJaNei, string | undefined> = {
    [SvarJaNei.JA]: 'Utgifter dekkes av annet regelverk',
    [SvarJaNei.NEI]: 'Utgifter dekkes ikke av annet regelverk',
    [SvarJaNei.JA_IMPLISITT]: undefined,
};

export const lønnetSvarTilTekst: Record<SvarJaNei, string | undefined> = {
    [SvarJaNei.JA]: 'Lønnet',
    [SvarJaNei.NEI]: 'Ikke lønnet',
    [SvarJaNei.JA_IMPLISITT]: undefined,
};

export const VilkårperiodeResultatTilTekst: Record<VilkårPeriodeResultat, string> = {
    [VilkårPeriodeResultat.OPPFYLT]: 'Vilkår oppfylt',
    [VilkårPeriodeResultat.IKKE_OPPFYLT]: 'Vilkår ikke oppfylt',
    [VilkårPeriodeResultat.IKKE_VURDERT]: 'Mangelfull vurdering',
    [VilkårPeriodeResultat.SLETTET]: 'Slettet',
};
