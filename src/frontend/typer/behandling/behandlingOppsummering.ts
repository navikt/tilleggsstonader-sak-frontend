import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { MålgruppeType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';
import { VilkårPeriodeResultat } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { StønadsvilkårType, Vilkårsresultat } from '../../Sider/Behandling/vilkår';
import { TypeVedtak } from '../vedtak/vedtak';

export interface BehandlingOppsummering {
    aktiviteter: OppsummertVilkårperiode<AktivitetType>[];
    målgrupper: OppsummertVilkårperiode<MålgruppeType>[];
    vilkår: Stønadsvilkår[];
    vedtaksresultat?: TypeVedtak;
    finnesDataÅOppsummere: boolean;
}

export type OppsummertVilkårperiode<T extends AktivitetType | MålgruppeType> = {
    id: string;
    fom: string;
    tom: string;
    resultat: VilkårPeriodeResultat;
    type: T;
};

export interface Stønadsvilkår {
    type: StønadsvilkårType;
    barnId: string | null;
    vilkår: OppsummertVilkår[];
}

interface OppsummertVilkår {
    id: string;
    fom?: string;
    tom?: string;
    resultat: Vilkårsresultat;
    utgift?: number;
}
