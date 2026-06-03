import { FaktaReiseTilSamling } from './faktaReiseTilSamling';
import { RegelIdReiseTilSamling } from './regelstrukturReiseTilSamling';
import { SvarId } from '../../../../../typer/regel';
import { VilkårBase } from '../../../vilkår';

export interface VilkårReiseTilSamling extends VilkårBase {
    adresse: string;
    reiseId: string;
    fakta: FaktaReiseTilSamling;
}

export type TypeReiseTilSamling = 'OFFENTLIG_TRANSPORT' | 'PRIVAT_BIL' | 'UBESTEMT';

export const typeReiseTilSamlingTilTekst: Record<TypeReiseTilSamling, string> = {
    OFFENTLIG_TRANSPORT: 'Offentlig transport',
    PRIVAT_BIL: 'Privat bil',
    UBESTEMT: 'UBESTEMT',
};

export interface SvarOgBegrunnelse {
    svar: SvarId;
    begrunnelse: string | undefined;
}

export type SvarVilkårReiseTilSamling = Record<
    RegelIdReiseTilSamling,
    SvarOgBegrunnelse | undefined
>;

export interface LagreNyttVilkårReiseTilSamling {
    fom: string;
    tom: string;
    adresse: string;
    reiseId: string;
    svar: SvarVilkårReiseTilSamling;
    fakta: FaktaReiseTilSamling;
}

export interface SlettVilkårReiseTilSamlingRequest {
    kommentar?: string;
}

export interface SlettVilkårReiseTilSamlingRespons {
    slettetPermanent: boolean;
    vilkår: VilkårReiseTilSamling;
}
