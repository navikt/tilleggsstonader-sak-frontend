import { DelvilkårKey } from './utils';
import { Vilkårsresultat } from '../../../vilkår';
import { SvarJaNei, VilkårPeriodeResultat } from '../../typer/vilkårperiode/vilkårperiode';

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

export const harUtgifterSvarTilTekst: Record<SvarJaNei, string | undefined> = {
    [SvarJaNei.JA]: 'Har utgifter',
    [SvarJaNei.NEI]: 'Har ikke utgifter',
    [SvarJaNei.JA_IMPLISITT]: undefined,
};

export const harRettTilUtstyrsstipendSvarTilTekst: Record<SvarJaNei, string | undefined> = {
    [SvarJaNei.JA]: 'Har rett til utstyrsstipend',
    [SvarJaNei.NEI]: 'Har ikke rett til utsstyrsstipend',
    [SvarJaNei.JA_IMPLISITT]: undefined,
};

export const VilkårperiodeResultatTilTekst: Record<VilkårPeriodeResultat, string> = {
    [VilkårPeriodeResultat.OPPFYLT]: 'Vilkår oppfylt',
    [VilkårPeriodeResultat.IKKE_OPPFYLT]: 'Vilkår ikke oppfylt',
    [VilkårPeriodeResultat.IKKE_VURDERT]: 'Mangelfull vurdering',
    [VilkårPeriodeResultat.SLETTET]: 'Slettet',
};

export const VilkårsresultatTilTekst: Record<Vilkårsresultat, string> = {
    [Vilkårsresultat.OPPFYLT]: 'Vilkår oppfylt',
    [Vilkårsresultat.IKKE_OPPFYLT]: 'Vilkår ikke oppfylt',
    [Vilkårsresultat.AUTOMATISK_OPPFYLT]: 'Vilkår automatisk oppfylt',
    [Vilkårsresultat.IKKE_AKTUELL]: 'Ikke aktuelt',
    [Vilkårsresultat.IKKE_TATT_STILLING_TIL]: 'Ikke vurdert',
    [Vilkårsresultat.SKAL_IKKE_VURDERES]: 'Skal ikke vurderes',
};

export const delvilkårKeyTilTekst: Record<DelvilkårKey, string> = {
    lønnet: 'ordinær lønn i tiltak',
    medlemskap: 'medlemskap',
    utgifterDekketAvAnnetRegelverk: 'utgifter dekket gjennom annet regelverk',
    harUtgifter: 'har utgifter til læremidler',
    harRettTilUtstyrsstipend: 'har rett til utstyrsstipend',
};

export const formaterDelvilkårKeys = (delvilkårKeys: DelvilkårKey[]) =>
    delvilkårKeys.map((d) => delvilkårKeyTilTekst[d]).join(', ');
