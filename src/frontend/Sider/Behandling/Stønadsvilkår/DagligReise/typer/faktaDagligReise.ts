import { TypeVilkårFakta } from './regelstrukturDagligReise';
import { TypeDagligReise } from './vilkårDagligReise';

export interface FaktaDagligReise {
    type: TypeDagligReise;
}

export interface FaktaOffentligTransport extends FaktaDagligReise {
    type: 'OFFENTLIG_TRANSPORT';
    reisedagerPerUke: number | undefined;
    prisEnkelbillett: number | undefined;
    prisSyvdagersbillett: number | undefined;
    prisTrettidagersbillett: number | undefined;
}

export interface FaktaPrivatBil extends FaktaDagligReise {
    type: 'PRIVAT_BIL';
    reisedagerPerUke: number | undefined;
    reiseavstandEnVei: number | undefined;
    bompengerEnVei: number | undefined;
    fergekostandEnVei: number | undefined;
}

export const typeDagligReiseTilTypeVilkårfakta: Record<TypeDagligReise, TypeVilkårFakta> = {
    OFFENTLIG_TRANSPORT: 'DAGLIG_REISE_OFFENTLIG_TRANSPORT',
    PRIVAT_BIL: 'DAGLIG_REISE_PRIVAT_BIL',
    UBESTEMT: 'DAGLIG_REISE_UBESTEMT',
};
