import { BegrunnelseRegel, SvarId } from '../../../../../typer/regel';
import { PeriodeStatus } from '../../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { Vilkårsresultat } from '../../../vilkår';

export enum RegelIdFlytting {
    SKAL_BRUKE_FLYTTEBYRÅ = 'SKAL_BRUKE_FLYTTEBYRÅ',
    SKAL_KJØRE_SELV = 'SKAL_KJØRE_SELV',
}

export interface FlyttebyråTilbud {
    navn: string | null;
    pris: number | null;
}

export type FaktaFlytting = { adresse: string | null } & (
    | {
          type: 'FLYTTING_FLYTTEBYRÅ';
          tilbud1: FlyttebyråTilbud;
          tilbud2: FlyttebyråTilbud;
      }
    | {
          type: 'FLYTTING_KJØRE_SELV';
          avstandEnVei: number | null;
          henger: number | null;
          bompenger: number | null;
          ferge: number | null;
          parkering: number | null;
      }
    | { type: 'FLYTTING_UBESTEMT' }
);

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
            regelId: RegelIdFlytting;
            svar?: SvarId | null;
            begrunnelse?: string | null;
        }[];
    }[];
    fakta: FaktaFlytting;
    slettetKommentar?: string | null;
}

export type RegelstrukturFlytting = Record<
    RegelIdFlytting,
    {
        erHovedregel: boolean;
        reglerSomMåNullstilles: RegelIdFlytting[];
        svaralternativer: {
            svarId: SvarId;
            nesteRegelId?: RegelIdFlytting | null;
            begrunnelseType: BegrunnelseRegel;
            tilhørendeFaktaType?: FaktaFlytting['type'] | null;
        }[];
    }
>;

export interface SlettVilkårFlyttingRespons {
    slettetPermanent: boolean;
    vilkår: VilkårFlytting;
}
