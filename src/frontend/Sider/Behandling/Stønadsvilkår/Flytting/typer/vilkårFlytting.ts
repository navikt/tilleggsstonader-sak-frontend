import { FaktaFlytting } from './faktaFlytting';
import { RegelIdFlytting } from './regelstrukturFlytting';
import { SvarId } from '../../../../../typer/regel';
import { PeriodeStatus } from '../../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { Vilkårsresultat } from '../../../vilkår';

export interface SvarOgBegrunnelseFlytting {
    svar: SvarId;
    begrunnelse?: string | null;
}

export interface LagreVilkårFlytting {
    fom: string;
    tom: string;
    svar: Partial<Record<RegelIdFlytting, SvarOgBegrunnelseFlytting>>;
    fakta: FaktaFlytting;
}

export interface VilkårFlytting {
    id: string;
    fom: string;
    tom: string;
    resultat: Vilkårsresultat;
    status: PeriodeStatus | null;
    delvilkårsett: {
        resultat: Vilkårsresultat;
        vurderinger: {
            regelId: string;
            svar?: SvarId | null;
            begrunnelse?: string | null;
        }[];
    }[];
    fakta: FaktaFlytting;
    slettetKommentar?: string | null;
}

export interface SlettVilkårFlyttingRespons {
    slettetPermanent: boolean;
    vilkår: VilkårFlytting;
}
