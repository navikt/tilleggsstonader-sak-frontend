import { TypeVilkårFakta } from './regelstrukturReiseTilSamling';
import { TypeReiseTilSamling } from './vilkårReiseTilSamling';

export interface FaktaReiseTilSamling {
    type: TypeReiseTilSamling;
}

export interface FaktaOffentligTransport extends FaktaReiseTilSamling {
    type: 'OFFENTLIG_TRANSPORT';
    utgifterOffentligTransport: number | undefined;
}

export interface FaktaPrivatBil extends FaktaReiseTilSamling {
    type: 'PRIVAT_BIL';
    reiseavstand: number | undefined;
}

export const typeReiseTilSamlingTilTypeVilkårFakta: Record<TypeReiseTilSamling, TypeVilkårFakta> = {
    OFFENTLIG_TRANSPORT: 'REISE_TIL_SAMLING_OFFENTLIG_TRANSPORT',
    PRIVAT_BIL: 'REISE_TIL_SAMLING_PRIVAT_BIL',
    UBESTEMT: 'REISE_TIL_SAMLING_UBESTEMT',
};
