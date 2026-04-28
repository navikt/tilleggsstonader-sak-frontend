import { FaktiskMålgruppe } from '../../Sider/Behandling/Felles/faktiskMålgruppe';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { Studienivå } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitetLæremidler';
import { TypeDagligReise } from '../../Sider/Behandling/Stønadsvilkår/DagligReise/typer/vilkårDagligReise';
import { TypeReiseTilSamling } from '../../Sider/Behandling/Stønadsvilkår/ReiseTilSamling/vilkårReiseTilSamling';
import { Stønadstype } from '../behandling/behandlingTema';

export interface VedtakperioderOversiktResponse {
    tilsynBarn: DetaljertVedtaksperiodeTilsynBarn[];
    læremidler: DetaljertVedtaksperiodeLæremidler[];
    boutgifter: DetaljertVedtaksperiodeBoutgifter[];
    dagligReiseTso: DetaljertVedtaksperiodeDagligReise[];
    dagligReiseTsr: DetaljertVedtaksperiodeDagligReise[];
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
    detaljertBeregningsperioder: DetaljertBeregningsperioderDagligReise[];
    adresse?: string;
};

export interface UtgiftBoutgift {
    fom: string;
    tom: string;
    utgift: number;
    beløpSomDekkes: number;
}

export type DetaljertVedtaksperiodeReiseTilSamling = {
    typeDagligReise: TypeReiseTilSamling;
    stønadstype: Stønadstype;
    // TODO
};
