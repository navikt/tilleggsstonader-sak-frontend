import { FaktaReiseOppstartAvslutningHjemreise } from './faktaReiseOppstartAvslutningHjemreise';
import { RegelIdROAH } from './regelstrukturReiseOppstartAvslutningHjemreise';
import { SvarId } from '../../../../../typer/regel';
import {
    RessursFeilet,
    RessursStatus,
    RessursStatusFeilet,
    RessursSuksess,
} from '../../../../../typer/ressurs';
import { VilkårBase } from '../../../vilkår';

export interface VilkårReiseOppstartAvslutningHjemreise extends VilkårBase {
    type: 'REISEVILKÅR';
    globalId?: string;
    reiseId: string;
    aktivitetId: string;
    typeReiseformål: TypeReiseformål;
    fakta: FaktaReiseOppstartAvslutningHjemreise;
    parentVilkår?: string;
}

export interface ParaplyvilkårReiseOppstartAvslutningHjemreise extends VilkårBase {
    type: 'PARAPLYVILKÅR';
    globalId?: string;
    aktivitetId: string;
    fraAdresse: string;
    tilAdresse: string;
}

export type VilkårROAH =
    VilkårReiseOppstartAvslutningHjemreise | ParaplyvilkårReiseOppstartAvslutningHjemreise;

export const erReise = (vilkår: VilkårROAH): vilkår is VilkårReiseOppstartAvslutningHjemreise =>
    vilkår.type === 'REISEVILKÅR';

export const erParaplyvilkår = (
    vilkår: VilkårROAH
): vilkår is ParaplyvilkårReiseOppstartAvslutningHjemreise => vilkår.type === 'PARAPLYVILKÅR';

export type TypeReiseOppstartAvslutningHjemreise =
    'OFFENTLIG_TRANSPORT' | 'PRIVAT_BIL' | 'UBESTEMT';

export const typeReiseOppstartAvslutningHjemreiseTilTekst: Record<
    TypeReiseOppstartAvslutningHjemreise,
    string
> = {
    OFFENTLIG_TRANSPORT: 'Offentlig transport',
    PRIVAT_BIL: 'Privat bil',
    UBESTEMT: 'UBESTEMT',
};

/**
 * Hvilken type reise vilkåret gjelder (oppstart, avslutning eller hjemreise). Lagres som eget felt på vilkåret,
 * satt direkte av saksbehandler – er ikke en del av selve regelverket/vurderingene.
 */
export type TypeReiseformål = 'OPPSTART' | 'AVSLUTNING' | 'HJEMREISE';

export const typeReiseformålTilTekst: Record<TypeReiseformål, string> = {
    OPPSTART: 'Oppstart',
    AVSLUTNING: 'Avslutning',
    HJEMREISE: 'Hjemreise',
};

export interface SvarOgBegrunnelse {
    svar: SvarId;
    begrunnelse: string | undefined;
}

export type SvarVilkårReiseOppstartAvslutningHjemreise = Partial<
    Record<RegelIdROAH, SvarOgBegrunnelse | undefined>
>;

export interface LagreNyttVilkårReiseOppstartAvslutningHjemreise {
    type: 'REISEVILKÅR';
    fom: string;
    tom: string;
    reiseId: string;
    aktivitetId: string;
    parentVilkår?: string;
    typeReiseformål: TypeReiseformål;
    svar: SvarVilkårReiseOppstartAvslutningHjemreise;
    fakta: FaktaReiseOppstartAvslutningHjemreise;
}

export interface LagreNyttParaplyvilkårReiseOpppstartAvslutningHjemreise {
    type: 'PARAPLYVILKÅR';
    fom: string;
    tom: string;
    aktivitetId: string;
    svar: SvarVilkårReiseOppstartAvslutningHjemreise;
    fraAdresse: string;
    tilAdresse: string;
}

export type LagreVilkårROAH =
    | LagreNyttVilkårReiseOppstartAvslutningHjemreise
    | LagreNyttParaplyvilkårReiseOpppstartAvslutningHjemreise;

export type LagreVilkårFunksjon = (
    vilkår: LagreNyttVilkårReiseOppstartAvslutningHjemreise
) => Promise<RessursSuksess<VilkårReiseOppstartAvslutningHjemreise> | RessursFeilet>;

export type SlettVilkårFunksjon = (
    vilkårId: string,
    slettetBegrunnelse: string | undefined
) => Promise<RessursStatus.SUKSESS | RessursStatusFeilet>;

export interface SlettVilkårReiseOppstartAvslutningHjemreiseRequest {
    kommentar?: string;
}

export interface SlettVilkårReiseOppstartAvslutningHjemreiseRespons {
    slettetPermanent: boolean;
    vilkår: VilkårROAH;
}

/**
 * Responsen fra GET-endepunktet grupperer reiser og paraplyvilkår per aktivitet fra inngangsvilkår. Brukes kun til
 * henting/flating ut av responsen – selve grupperingen for visning gjøres på nytt ut fra aktivitetene i konteksten, se
 * StønadsvilkårReiseOppstartAvslutningHjemreise.
 */
export interface AktivitetMedReiser {
    aktivitetId: string;
    aktivitetType: string;
    tiltaksvariant?: string;
    fom: string;
    tom: string;
    reiser: VilkårReiseOppstartAvslutningHjemreise[];
    paraplyvilkår: ParaplyvilkårReiseOppstartAvslutningHjemreise[];
}
