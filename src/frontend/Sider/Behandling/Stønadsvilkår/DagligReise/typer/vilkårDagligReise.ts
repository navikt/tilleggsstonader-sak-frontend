import { FaktaDagligReise } from './faktaDagligReise';
import { RegelIdDagligReise } from './regelstrukturDagligReise';
import { SvarId } from '../../../../../typer/regel';
import { VilkårBase } from '../../../vilkår';

export interface VilkårDagligReise extends VilkårBase {
    adresse?: string;
    fakta?: FaktaDagligReise;
}

export type TypeDagligReise = 'OFFENTLIG_TRANSPORT' | 'PRIVAT_BIL';

export const typeDagligReiseTilTekst: Record<TypeDagligReise, string> = {
    OFFENTLIG_TRANSPORT: 'Offentlig transport',
    PRIVAT_BIL: 'Privat bil',
};

export interface SvarOgBegrunnelse {
    svar: SvarId;
    begrunnelse: string | undefined;
}

export type SvarVilkårDagligReise = Record<RegelIdDagligReise, SvarOgBegrunnelse | undefined>;

export interface LagreNyttVilkårDagligReise {
    fom: string;
    tom: string;
    adresse: string;
    svar: SvarVilkårDagligReise;
    fakta?: FaktaDagligReise;
}

export interface SlettVilkårDagligReiseRequest {
    kommentar?: string;
}

export interface SlettVilkårDagligReiseRespons {
    slettetPermanent: boolean;
    vilkår: VilkårDagligReise;
}
