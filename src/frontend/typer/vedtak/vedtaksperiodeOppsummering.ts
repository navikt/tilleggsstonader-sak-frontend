import { RammeForReiseMedPrivatBil } from './vedtakDagligReise';
import { BeregningsgrunnlagType } from './vedtakFlytting';
import { FaktiskMålgruppe } from '../../Sider/Behandling/Felles/faktiskMålgruppe';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { Studienivå } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitetLæremidler';
import { TypeDagligReise } from '../../Sider/Behandling/Stønadsvilkår/DagligReise/typer/vilkårDagligReise';
import { Stønadstype } from '../behandling/behandlingTema';

export interface VedtakperioderOversiktResponse {
    // Bør være passAvBarn, men sendes fra backend som tilsynBarn
    tilsynBarn: DetaljertVedtaksperiodePassAvBarn[];
    læremidler: DetaljertVedtaksperiodeLæremidler[];
    boutgifter: DetaljertVedtaksperiodeBoutgifter[];
    dagligReiseTso: DetaljertVedtaksperiodeDagligReise[];
    dagligReiseTsr: DetaljertVedtaksperiodeDagligReise[];
    reiseTilSamlingTso: DetaljertVedtaksperiodeReiseTilSamling[];
    reiseTilSamlingTsr: DetaljertVedtaksperiodeReiseTilSamling[];
    flyttingTso: DetaljertVedtaksperiodeFlytting[];
    flyttingTsr: DetaljertVedtaksperiodeFlytting[];
}

export type DetaljertVedtaksperiodePassAvBarn = {
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

export type DetaljertBeregningsperioderDagligReise = {
    fom: string;
    tom: string;
    prisEnkeltbillett: number | null;
    prisSyvdagersbillett: number | null;
    pris30dagersbillett: number | null;
    beløp: number;
    billettdetaljer: Record<string, number>;
    antallReisedager: number;
    antallReisedagerPerUke: number;
};

export type DetaljertVedtaksperiodeDagligReise = {
    typeDagligReise: TypeDagligReise;
    stønadstype: Stønadstype;
    detaljertBeregningsperioder: DetaljertBeregningsperioderDagligReise[] | null;
    adresse: string | null;
    rammevedtakPrivatBil: RammeForReiseMedPrivatBil | null;
};

export interface UtgiftBoutgift {
    fom: string;
    tom: string;
    utgift: number;
    beløpSomDekkes: number;
}

export type DetaljertVedtaksperiodeReiseTilSamling = {
    stønadstype: Stønadstype;
    fom: string;
    tom: string;
    beløp: number;
};

export type DetaljertVedtaksperiodeFlytting = {
    stønadstype: Stønadstype.FLYTTING_TSO | Stønadstype.FLYTTING_TSR;
    fom: string;
    tom: string;
    målgruppe: FaktiskMålgruppe;
    beløp: number;
    flyttemåte: BeregningsgrunnlagType;
    skalUtbetales: boolean;
};
