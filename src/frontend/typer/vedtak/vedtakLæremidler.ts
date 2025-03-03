import { TypeVedtak, ÅrsakAvslag } from './vedtak';
import { OpphørRequest } from '../../hooks/useLagreOpphør';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { Studienivå } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitetLæremidler';
import { MålgruppeType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';
import { Periode } from '../../utils/periode';
import { PeriodeStatus } from '../behandling/periodeStatus';

export type VedtakLæremidler = InnvilgelseLæremidler | AvslagLæremidler | OpphørLæremidler;

export const vedtakErInnvilgelse = (vedtak: VedtakLæremidler): vedtak is InnvilgelseLæremidler =>
    vedtak.type === TypeVedtak.INNVILGELSE;

export const vedtakErAvslag = (vedtak: VedtakLæremidler): vedtak is AvslagLæremidler =>
    vedtak.type === TypeVedtak.AVSLAG;

export const vedtakErOpphør = (vedtak: VedtakLæremidler): vedtak is OpphørLæremidler =>
    vedtak.type === TypeVedtak.OPPHØR;

export type InnvilgelseLæremidlerRequest = {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Vedtaksperiode[];
};

export interface InnvilgelseLæremidler {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Vedtaksperiode[];
    beregningsresultat: BeregningsresultatLæremidler;
    gjelderFraOgMed: string;
    gjelderTilOgMed: string;
}

export interface BeregningsresultatLæremidler {
    perioder: BeregningsresultatForPeriode[];
}

interface BeregningsresultatForPeriode {
    fom: string;
    tom: string;
    antallMåneder: number;
    studienivå: Studienivå;
    studieprosent: number;
    // beløp er sats TODO rename?
    beløp: number;
    stønadsbeløp: number;
    utbetalingsdato: string;
    målgruppe: MålgruppeType;
    aktivitet: AktivitetType;
    delAvTidligereUtbetaling: boolean;
}

export type AvslåLæremidlerRequest = {
    type: TypeVedtak.AVSLAG;
    årsakerAvslag: ÅrsakAvslag[];
    begrunnelse: string;
};

export type AvslagLæremidler = AvslåLæremidlerRequest;

export type OpphørLæremidler = OpphørRequest & {
    beregningsresultat: BeregningsresultatLæremidler;
};

export interface Vedtaksperiode extends Periode {
    id: string;
    status?: PeriodeStatus;
}
