import { v4 as uuidv4 } from 'uuid';

import { TypeVedtak, ÅrsakAvslag } from './vedtak';
import { OpphørRequest } from '../../hooks/useLagreOpphør';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { MålgruppeType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';
import { Periode } from '../../utils/periode';
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

export interface InnvilgelseBarnetilsyn {
    type: TypeVedtak.INNVILGELSE;
    beregningsresultat: BeregningsresultatTilsynBarn;
}

export type AvslåBarnetilsynRequest = {
    type: TypeVedtak.AVSLAG;
    årsakerAvslag: ÅrsakAvslag[];
    begrunnelse: string;
};

export type AvslagBarnetilsyn = AvslåBarnetilsynRequest;

export type OpphørBarnetilsyn = OpphørRequest & {
    beregningsresultat: BeregningsresultatTilsynBarn;
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
    målgruppe?: MålgruppeType;
    aktivitet?: AktivitetType;
}

export const vedtaksperiodeTilVedtakperiodeTilsynBarn = (
    vedtaksperiode?: Vedtaksperiode[]
): VedtaksperiodeTilsynBarn[] | undefined => {
    if (!vedtaksperiode) {
        return;
    }
    return vedtaksperiode.map((periode) => ({
        id: uuidv4(),
        status: PeriodeStatus.UENDRET,
        fom: periode.fom,
        tom: periode.tom,
        målgruppe: periode.målgruppe,
        aktivitet: periode.aktivitet,
    }));
};
