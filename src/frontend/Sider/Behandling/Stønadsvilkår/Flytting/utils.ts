import { VilkårFlytting } from './typer/vilkårFlytting';
import { tilTallverdi } from '../../../../utils/tall';
import { PeriodeStatus } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { StønadsvilkårType, VilkårBase } from '../../vilkår';

export function tilEkstrakostnad(verdi: string): number | null {
    const utenMellomrom = verdi.replace(/\s/g, '');
    if (!utenMellomrom) {
        return null;
    }
    const tallverdi = tilTallverdi(utenMellomrom);
    return typeof tallverdi === 'string'
        ? Number(tallverdi.replace(/,/g, '.'))
        : (tallverdi ?? Number.NaN);
}

// TODO Sjekke om disse faktisk er nødvendig

export function tilDelvilkår(vilkår: VilkårFlytting): VilkårBase['delvilkårsett'] {
    return vilkår.delvilkårsett.map((delvilkår) => ({
        ...delvilkår,
        vurderinger: delvilkår.vurderinger.map((vurdering) => ({
            ...vurdering,
            svar: vurdering.svar ?? undefined,
            begrunnelse: vurdering.begrunnelse ?? undefined,
        })),
    }));
}

export function tilVilkårBase(vilkår: VilkårFlytting, behandlingId: string): VilkårBase {
    return {
        ...vilkår,
        fom: vilkår.flyttedato,
        tom: vilkår.flyttedato,
        behandlingId,
        status: vilkår.status ?? PeriodeStatus.UENDRET,
        delvilkårsett: tilDelvilkår(vilkår),
        slettetKommentar: vilkår.slettetKommentar ?? undefined,
        vilkårType: StønadsvilkårType.FLYTTING,
    };
}
