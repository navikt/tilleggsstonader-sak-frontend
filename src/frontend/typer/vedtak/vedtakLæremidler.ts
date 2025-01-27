import { TypeVedtak, ÅrsakAvslag, ÅrsakOpphør } from './vedtak';
import { Studienivå } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitetLæremidler';
import { Periode } from '../../utils/periode';

export type VedtakLæremidler = InnvilgelseLæremidler | AvslagLæremidler | OpphørLæremidler;

export type InnvilgelseLæremidlerRequest = {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Periode[];
};

export interface InnvilgelseLæremidler {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Periode[];
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
}

export type AvslåLæremidlerRequest = {
    type: TypeVedtak.AVSLAG;
    årsakerAvslag: ÅrsakAvslag[];
    begrunnelse: string;
};

export type AvslagLæremidler = AvslåLæremidlerRequest;

export type OpphørLæremidlerRequest = {
    type: TypeVedtak.OPPHØR;
    årsakerOpphør: ÅrsakOpphør[];
    begrunnelse: string;
};

export type OpphørLæremidler = OpphørLæremidlerRequest;
