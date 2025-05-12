import { TypeBoutgift } from './vedtakBoutgifter';
import { FaktiskMålgruppe } from '../../Sider/Behandling/Felles/faktiskMålgruppe';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { Studienivå } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitetLæremidler';

export interface VedtakperioderOversiktResponse {
    tilsynBarn: DetaljertVedtaksperiodeTilsynBarn[];
    læremidler: DetaljertVedtaksperiodeLæremidler[];
    boutgifter: DetaljertVedtaksperiodeBoutgifter[];
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
    type: TypeBoutgift;
    aktivitet: AktivitetType;
    målgruppe: FaktiskMålgruppe;
    utgift: number;
    stønad: number;
};
