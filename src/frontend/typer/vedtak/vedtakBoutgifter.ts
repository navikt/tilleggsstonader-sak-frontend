import { TypeVedtak, ÅrsakAvslag } from './vedtak';
import { Vedtaksperiode } from './vedtakperiode';
import { OpphørRequest } from '../../hooks/useLagreOpphør';
import { FaktiskMålgruppe } from '../../Sider/Behandling/Felles/faktiskMålgruppe';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';

export type VedtakBoutgifter = InnvilgelseBoutgifter | AvslagBoutgifter | OpphørBoutgifter;

export enum TypeBoutgift {
    UTGIFTER_OVERNATTING = 'UTGIFTER_OVERNATTING',
    LØPENDE_UTGIFTER_EN_BOLIG = 'LØPENDE_UTGIFTER_EN_BOLIG',
    LØPENDE_UTGIFTER_TO_BOLIGER = 'LØPENDE_UTGIFTER_TO_BOLIGER',
}

export const TypeboutgiftTilTekst: Record<TypeBoutgift, string> = {
    UTGIFTER_OVERNATTING: 'Overnatting',
    LØPENDE_UTGIFTER_EN_BOLIG: 'Løpende',
    LØPENDE_UTGIFTER_TO_BOLIGER: 'Løpende',
};

export const typeBoutgiftTilTekst = (type: TypeBoutgift) => {
    return TypeboutgiftTilTekst[type];
};

export const vedtakErInnvilgelse = (vedtak: VedtakBoutgifter): vedtak is InnvilgelseBoutgifter =>
    vedtak.type === TypeVedtak.INNVILGELSE;

export const vedtakErAvslag = (vedtak: VedtakBoutgifter): vedtak is AvslagBoutgifter =>
    vedtak.type === TypeVedtak.AVSLAG;

export const vedtakErOpphør = (vedtak: VedtakBoutgifter): vedtak is OpphørBoutgifter =>
    vedtak.type === TypeVedtak.OPPHØR;

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

export enum BeregningsresultatUtgifterKeys {
    UTGIFTER_OVERNATTING = 'UTGIFTER_OVERNATTING',
    LØPENDE_UTGIFTER_EN_BOLIG = 'LØPENDE_UTGIFTER_EN_BOLIG',
    LØPENDE_UTGIFTER_TO_BOLIGER = 'LØPENDE_UTGIFTER_TO_BOLIGER',
}

export type BeregningsresultatUtgifterMap = {
    [key in BeregningsresultatUtgifterKeys]: BeregningsresultatUtgifter[];
};

export type BeregningsresultatUtgifter = {
    fom: string;
    tom: string;
    utgift: number;
};

type Beregningsresultat = {
    stønadsbeløp: number;
    fom: string;
    tom: string;
    utbetalingsdato: string;
    sumUtgifter: number;
    utgifter: BeregningsresultatUtgifterMap;
    målgruppe: FaktiskMålgruppe;
    aktivitet: AktivitetType;
    makssatsBekreftet: boolean;
    delAvTidligereUtbetaling: boolean;
};
