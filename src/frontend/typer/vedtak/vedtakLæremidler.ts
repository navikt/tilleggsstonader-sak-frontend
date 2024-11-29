import { TypeVedtak, ÅrsakAvslag } from './vedtak';

export type VedtakLæremidler = AvslagLæremidler;

export type AvslåLæremidlerRequest = {
    type: TypeVedtak.AVSLAG;
    årsakerAvslag: ÅrsakAvslag[];
    begrunnelse: string;
};

export type AvslagLæremidler = AvslåLæremidlerRequest;
