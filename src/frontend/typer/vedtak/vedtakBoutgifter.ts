import { TypeVedtak, ÅrsakAvslag } from './vedtak';
import { Vedtaksperiode } from './vedtakperiode';
import { OpphørRequest } from '../../hooks/useLagreOpphør';
import { FaktiskMålgruppe } from '../../Sider/Behandling/Felles/faktiskMålgruppe';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';

export type VedtakBoutgifter = InnvilgelseBoutgifter | AvslagBoutgifter | OpphørBoutgifter;

export const vedtakErInnvilgelse = (vedtak: VedtakBoutgifter): vedtak is InnvilgelseBoutgifter =>
    vedtak.type === TypeVedtak.INNVILGELSE;

export const vedtakErAvslag = (vedtak: VedtakBoutgifter): vedtak is AvslagBoutgifter =>
    vedtak.type === TypeVedtak.AVSLAG;

// export const vedtakErOpphør = (vedtak: VedtakBoutgifter): vedtak is OpphørBoutgifter =>
//     vedtak.type === TypeVedtak.OPPHØR;

export type InnvilgeBoutgifterRequest = {
    vedtaksperioder: Vedtaksperiode[];
    begrunnelse?: string;
};

export interface InnvilgelseBoutgifter {
    type: TypeVedtak.INNVILGELSE;
    beregningsresultat: BeregningsresultatBoutgifter;
    vedtaksperioder: Vedtaksperiode[];
    begrunnelse?: string;
    gjelderFraOgMed?: string;
    gjelderTilOgMed?: string;
}

export type AvslåBoutgifterRequest = {
    type: TypeVedtak.AVSLAG;
    årsakerAvslag: ÅrsakAvslag[];
    begrunnelse: string;
};

export type AvslagBoutgifter = AvslåBoutgifterRequest;

export type OpphørBoutgifter = OpphørRequest & {
    beregningsresultat: BeregningsresultatBoutgifter;
    vedtaksperioder: Vedtaksperiode[];
};

export type BeregnBoutgifterRequest = {
    vedtaksperioder: Vedtaksperiode[];
};

export type BeregningsresultatBoutgifter = {
    perioder: Beregningsresultat[];
};

type Beregningsresultat = {
    stønadsbeløp: number;
    fom: string;
    tom: string;
    utbetalingsdato: string;
    sumUtgifter: number;
    målgruppe: FaktiskMålgruppe;
    aktivitet: AktivitetType;
    makssatsBekreftet: boolean;
    delAvTidligereUtbetaling: boolean;
};
