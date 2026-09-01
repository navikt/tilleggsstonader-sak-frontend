import { FaktaReiseOppstartAvslutningHjemreise } from './faktaReiseOppstartAvslutningHjemreise';
import { RegelIdReiseOppstartAvslutningHjemreise } from './regelstrukturReiseOppstartAvslutningHjemreise';
import { SvarId } from '../../../../../typer/regel';
import { VilkårBase } from '../../../vilkår';

export interface VilkårReiseOppstartAvslutningHjemreise extends VilkårBase {
    adresse: string;
    reiseId: string;
    typeReiseformål: TypeReiseformål;
    fakta: FaktaReiseOppstartAvslutningHjemreise;
}

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

export type SvarVilkårReiseOppstartAvslutningHjemreise = Record<
    RegelIdReiseOppstartAvslutningHjemreise,
    SvarOgBegrunnelse | undefined
>;

export interface LagreNyttVilkårReiseOppstartAvslutningHjemreise {
    fom: string;
    tom: string;
    adresse: string;
    reiseId: string;
    typeReiseformål: TypeReiseformål;
    svar: SvarVilkårReiseOppstartAvslutningHjemreise;
    fakta: FaktaReiseOppstartAvslutningHjemreise;
}

export interface SlettVilkårReiseOppstartAvslutningHjemreiseRequest {
    kommentar?: string;
}

export interface SlettVilkårReiseOppstartAvslutningHjemreiseRespons {
    slettetPermanent: boolean;
    vilkår: VilkårReiseOppstartAvslutningHjemreise;
}

/**
 * Responsen fra GET-endepunktet grupperer reisene per aktivitet fra inngangsvilkår. Brukes kun til henting/flating
 * ut av responsen – selve grupperingen for visning gjøres på nytt ut fra aktivitetene i konteksten, se
 * StønadsvilkårReiseOppstartAvslutningHjemreise.
 */
export interface AktivitetMedReiser {
    aktivitetId: string;
    aktivitetType: string;
    tiltaksvariant?: string;
    fom: string;
    tom: string;
    reiser: VilkårReiseOppstartAvslutningHjemreise[];
}
