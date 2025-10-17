import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { MålgruppeType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';
import { VilkårPeriodeResultat } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { TypeDagligReise } from '../../Sider/Behandling/Stønadsvilkår/DagligReise/typer/vilkårDagligReise';
import { StønadsvilkårType, Vilkårsresultat } from '../../Sider/Behandling/vilkår';
import { TypeVedtak, ÅrsakAvslag, ÅrsakOpphør } from '../vedtak/vedtak';
import { Vedtaksperiode } from '../vedtak/vedtakperiode';

export interface BehandlingOppsummering {
    aktiviteter: OppsummertVilkårperiode<AktivitetType>[];
    målgrupper: OppsummertVilkårperiode<MålgruppeType>[];
    vilkår: Stønadsvilkår[];
    vedtak: OppsummertVedtak;
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

export interface OppsummertVilkår {
    id: string;
    fom?: string;
    tom?: string;
    resultat: Vilkårsresultat;
    utgift?: number;
    typeDagligReise?: TypeDagligReise;
}

export type OppsummertVedtak =
    | OppsummertVedtakInnvilgelse
    | OppsummertVedtakAvslag
    | OppsummertVedtakOpphør;

export interface OppsummertVedtakInnvilgelse {
    resultat: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Vedtaksperiode[];
}

export interface OppsummertVedtakAvslag {
    resultat: TypeVedtak.AVSLAG;
    årsaker: ÅrsakAvslag[];
}

export interface OppsummertVedtakOpphør {
    resultat: TypeVedtak.OPPHØR;
    årsaker: ÅrsakOpphør[];
    opphørsdato: string;
}
