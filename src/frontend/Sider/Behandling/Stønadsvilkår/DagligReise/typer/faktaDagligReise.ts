import { TypeVilkårFakta } from './regelstrukturDagligReise';
import { TypeDagligReise } from './vilkårDagligReise';
export interface FaktaDagligReise {
    type: TypeDagligReise;
}

export interface FaktaOffentligTransport extends FaktaDagligReise {
    '@type': 'FAKTA_DAGLIG_REISE_OFFENTLIG_TRANSPORT';
    reisedagerPerUke: number | undefined;
    prisEnkelbillett: number | undefined;
    prisSyvdagersbillett: number | undefined;
    prisTrettidagersbillett: number | undefined;
}

export const erFaktaOffentligTransport = (
    fakta: FaktaDagligReise | undefined
): fakta is FaktaOffentligTransport => !!fakta && fakta.type === 'OFFENTLIG_TRANSPORT';

export const typeDagligReiseTilTypeVilkårfakta: Record<TypeDagligReise, TypeVilkårFakta> = {
    OFFENTLIG_TRANSPORT: 'DAGLIG_REISE_OFFENTLIG_TRANSPORT',
    PRIVAT_BIL: 'DAGLIG_REISE_PRIVAT_BIL',
};
