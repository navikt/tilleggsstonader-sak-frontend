import { VilkårFlytting } from './typer/vilkårFlytting';
import { PeriodeStatus } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { StønadsvilkårType, VilkårBase } from '../../vilkår';

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
        behandlingId,
        status: vilkår.status ?? PeriodeStatus.UENDRET,
        delvilkårsett: tilDelvilkår(vilkår),
        slettetKommentar: vilkår.slettetKommentar ?? undefined,
        vilkårType: StønadsvilkårType.FLYTTING,
    };
}
