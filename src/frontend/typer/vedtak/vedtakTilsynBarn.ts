import { TypeVedtak, ÅrsakAvslag } from './vedtak';
import { FormErrors } from '../../hooks/felles/useFormState';
import { OpphørRequest } from '../../hooks/useLagreOpphør';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { MålgruppeType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';
import { Periode, validerPeriode } from '../../utils/periode';
import { PeriodeStatus } from '../behandling/periodeStatus';

export type VedtakBarnetilsyn = InnvilgelseBarnetilsyn | AvslagBarnetilsyn | OpphørBarnetilsyn;

export const vedtakErInnvilgelse = (vedtak: VedtakBarnetilsyn): vedtak is InnvilgelseBarnetilsyn =>
    vedtak.type === TypeVedtak.INNVILGELSE;

export const vedtakErAvslag = (vedtak: VedtakBarnetilsyn): vedtak is AvslagBarnetilsyn =>
    vedtak.type === TypeVedtak.AVSLAG;

export const vedtakErOpphør = (vedtak: VedtakBarnetilsyn): vedtak is OpphørBarnetilsyn =>
    vedtak.type === TypeVedtak.OPPHØR;

export type InnvilgeBarnetilsynRequest = {
    type: TypeVedtak.INNVILGELSE;
};

export type InnvilgeBarnetilsynRequestV2 = {
    vedtaksperioder: VedtaksperiodeTilsynBarn[];
};

export interface InnvilgelseBarnetilsyn {
    type: TypeVedtak.INNVILGELSE;
    beregningsresultat: BeregningsresultatTilsynBarn;
    vedtaksperioder: VedtaksperiodeTilsynBarn[];
}

export type AvslåBarnetilsynRequest = {
    type: TypeVedtak.AVSLAG;
    årsakerAvslag: ÅrsakAvslag[];
    begrunnelse: string;
};

export type AvslagBarnetilsyn = AvslåBarnetilsynRequest;

export type OpphørBarnetilsyn = OpphørRequest & {
    beregningsresultat: BeregningsresultatTilsynBarn;
    vedtaksperioder: VedtaksperiodeTilsynBarn[];
};

export type BeregningsresultatTilsynBarn = {
    perioder: Beregningsresultat[];
    vedtaksperioder: Vedtaksperiode[];
    gjelderFraOgMed?: string;
    gjelderTilOgMed?: string;
};

type Beregningsresultat = {
    dagsats: number;
    månedsbeløp: number;
    grunnlag: Beregningsgrunnlag;
};

export interface Vedtaksperiode {
    fom: string;
    tom: string;
    målgruppe: MålgruppeType;
    aktivitet: AktivitetType;
    antallBarn: number;
}

type Beregningsgrunnlag = {
    måned: string;
    utgifterTotal: number;
    antallBarn: number;
};

export interface VedtaksperiodeTilsynBarn extends Periode {
    id: string;
    status?: PeriodeStatus;
    målgruppeType?: MålgruppeType;
    aktivitetType?: AktivitetType;
}

export const validerVedtaksperioder = (
    vedtaksperioder: VedtaksperiodeTilsynBarn[],
    lagretVedtaksperioder: Map<string, VedtaksperiodeTilsynBarn>,
    revurderesFraDato?: string
): FormErrors<VedtaksperiodeTilsynBarn[]> =>
    vedtaksperioder.map((vedtaksperiode) => {
        const vedtaksperiodeFeil: FormErrors<VedtaksperiodeTilsynBarn> = {
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
