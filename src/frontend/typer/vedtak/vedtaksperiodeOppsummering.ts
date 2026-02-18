import { FaktiskMålgruppe } from '../../Sider/Behandling/Felles/faktiskMålgruppe';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { Studienivå } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitetLæremidler';
import { TypeDagligReise } from '../../Sider/Behandling/Stønadsvilkår/DagligReise/typer/vilkårDagligReise';
import { BillettType } from '../behandling/behandlingFakta/faktaReise';
import { Stønadstype } from '../behandling/behandlingTema';

export interface VedtakperioderOversiktResponse {
    tilsynBarn: DetaljertVedtaksperiodeTilsynBarn[];
    læremidler: DetaljertVedtaksperiodeLæremidler[];
    boutgifter: DetaljertVedtaksperiodeBoutgifter[];
    dagligReiseTso: DetaljertVedtaksperiodeDagligReiseTso[];
    dagligReiseTsr: DetaljertVedtaksperiodeDagligReiseTsr[];
}

export type DetaljertVedtaksperiodeTilsynBarn = {
    fom: string;
    tom: string;
    aktivitet: AktivitetType;
    målgruppe: FaktiskMålgruppe;
    antallBarn: number;
    totalMånedsUtgift: number;
};

export type DetaljertVedtaksperiodeLæremidler = {
    fom: string;
    tom: string;
    antallMåneder: number;
    aktivitet: AktivitetType;
    målgruppe: FaktiskMålgruppe;
    studienivå: Studienivå;
    studieprosent: number;
    månedsbeløp: number;
};

export type DetaljertVedtaksperiodeBoutgifter = {
    fom: string;
    tom: string;
    antallMåneder: number;
    erLøpendeUtgift: boolean;
    aktivitet: AktivitetType;
    målgruppe: FaktiskMålgruppe;
    totalUtgiftMåned: number;
    stønadsbeløpMnd: number;
    utgifterTilOvernatting?: UtgiftBoutgift[];
};

export type DetaljertVedtaksperiodeDagligReiseTso = {
    fom: string;
    tom: string;
    aktivitet: AktivitetType;
    målgruppe: FaktiskMålgruppe;
    typeDagligReise: TypeDagligReise;
    stønadstype: Stønadstype;
    beregningsresultat: BeregningsresultatForPeriodeDto[];
};

export type DetaljertVedtaksperiodeDagligReiseTsr = {
    fom: string;
    tom: string;
    aktivitet: AktivitetType;
    målgruppe: FaktiskMålgruppe;
    typeDagligReise: TypeDagligReise;
    stønadstype: Stønadstype;
    beregningsresultat: BeregningsresultatForPeriodeDto[];
};

export interface UtgiftBoutgift {
    fom: string;
    tom: string;
    utgift: number;
    beløpSomDekkes: number;
}
export interface BeregningsresultatForPeriodeDto {
    fom: string;
    tom: string;
    prisEnkeltbillett?: number;
    prisSyvdagersbillett?: number;
    pris30dagersbillett?: number;
    antallReisedagerPerUke?: number;
    antallReisedager?: number;
    beløp: number;
    billettdetaljer?: Partial<Record<BillettType, number>>;
}
