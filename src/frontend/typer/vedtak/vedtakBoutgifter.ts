import { TypeVedtak, ÅrsakAvslag } from './vedtak';
import { FormErrors } from '../../hooks/felles/useFormState';
import { OpphørRequest } from '../../hooks/useLagreOpphør';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { MålgruppeType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';
import { Periode, validerPeriode } from '../../utils/periode';
import { PeriodeStatus } from '../behandling/periodeStatus';

export type VedtakBoutgifter = InnvilgelseBoutgifter | AvslagBoutgifter | OpphørBoutgifter;

export const vedtakErInnvilgelse = (vedtak: VedtakBoutgifter): vedtak is InnvilgelseBoutgifter =>
    vedtak.type === TypeVedtak.INNVILGELSE;

// export const vedtakErAvslag = (vedtak: VedtakBoutgifter): vedtak is AvslagBoutgifter =>
//     vedtak.type === TypeVedtak.AVSLAG;

// export const vedtakErOpphør = (vedtak: VedtakBoutgifter): vedtak is OpphørBoutgifter =>
//     vedtak.type === TypeVedtak.OPPHØR;

export type InnvilgeBoutgifterRequest = {
    vedtaksperioder: VedtaksperiodeBoutgifter[];
    begrunnelse?: string;
};

export interface InnvilgelseBoutgifter {
    type: TypeVedtak.INNVILGELSE;
    beregningsresultat: BeregningsresultatBoutgifter;
    vedtaksperioder: VedtaksperiodeBoutgifter[];
    begrunnelse?: string;
}

export type AvslåBoutgifterRequest = {
    type: TypeVedtak.AVSLAG;
    årsakerAvslag: ÅrsakAvslag[];
    begrunnelse: string;
};

export type AvslagBoutgifter = AvslåBoutgifterRequest;

export type OpphørBoutgifter = OpphørRequest & {
    beregningsresultat: BeregningsresultatBoutgifter;
    vedtaksperioder: VedtaksperiodeBoutgifter[];
};

export type BeregnBoutgifterRequest = {
    vedtaksperioder: VedtaksperiodeBoutgifter[];
};

export type BeregningsresultatBoutgifter = {
    perioder: Beregningsresultat[];
    vedtaksperioder: Vedtaksperiode[];
    gjelderFraOgMed?: string;
    gjelderTilOgMed?: string;
};

type Beregningsresultat = {
    stønadsbeløp: number;
    fom: string;
    tom: string;
    utbetalingsdato: string;
    utgifter: number;
    makssats: number;
    målgruppe: string;
    aktivitet: string;
    delAvTidligereUtbetaling: boolean;
};

export interface Vedtaksperiode {
    fom: string;
    tom: string;
    målgruppe: MålgruppeType;
    aktivitet: AktivitetType;
}

export interface VedtaksperiodeBoutgifter extends Periode {
    id: string;
    status?: PeriodeStatus;
    målgruppeType?: MålgruppeType;
    aktivitetType?: AktivitetType;
}

export const validerVedtaksperioder = (
    vedtaksperioder: VedtaksperiodeBoutgifter[],
    lagretVedtaksperioder: Map<string, VedtaksperiodeBoutgifter>,
    revurderesFraDato?: string
): FormErrors<VedtaksperiodeBoutgifter[]> =>
    vedtaksperioder.map((vedtaksperiode) => {
        const vedtaksperiodeFeil: FormErrors<VedtaksperiodeBoutgifter> = {
            id: undefined,
            målgruppeType: undefined,
            aktivitetType: undefined,
            fom: undefined,
            tom: undefined,
        };

        if (!vedtaksperiode.aktivitetType) {
            return { ...vedtaksperiodeFeil, aktivitetType: 'Mangler aktivitet for periode' };
        }

        if (!vedtaksperiode.målgruppeType) {
            return { ...vedtaksperiodeFeil, målgruppeType: 'Mangler målgruppe for periode' };
        }

        const lagretPeriode = lagretVedtaksperioder.get(vedtaksperiode.id);

        const periodeValidering = validerPeriode(vedtaksperiode, lagretPeriode, revurderesFraDato);
        if (periodeValidering) {
            return {
                ...vedtaksperiodeFeil,
                ...periodeValidering,
            };
        }

        return vedtaksperiodeFeil;
    });
