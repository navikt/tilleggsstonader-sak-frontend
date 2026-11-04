import { TypeVilkårFakta } from './regelstrukturReiseTilSamling';
import { TypeReiseTilSamling } from './vilkårReiseTilSamling';
import { NødvendigUtgift, SvarJaNei } from '../../../../../typer/nødvendigUtgift';
import { AktivitetInfo } from '../felles/aktivitetInfo';

export interface FaktaReiseTilSamling {
    type: TypeReiseTilSamling;
    aktivitet?: AktivitetInfo;
}

export interface FaktaOffentligTransport extends FaktaReiseTilSamling {
    type: 'OFFENTLIG_TRANSPORT';
    utgifterOffentligTransport: number | undefined;
    begrunnelse: string | undefined;
    nødvendigUtgift: NødvendigUtgift | undefined;
}

export interface FaktaPrivatBil extends FaktaReiseTilSamling {
    type: 'PRIVAT_BIL';
    reiseavstand: number | undefined;
    begrunnelse: string | undefined;
    nødvendigUtgift: NødvendigUtgift | undefined;
    bompenger: number | undefined;
    fergekostnad: number | undefined;
    parkering: number | undefined;
    piggdekkavgift: number | undefined;
}

export interface FaktaDrosje extends FaktaReiseTilSamling {
    type: 'DROSJE';
    utgifterDrosje: number | undefined;
    begrunnelse: string | undefined;
    nødvendigUtgift: NødvendigUtgift | undefined;
}

export const erSvarJaNei = (svarId: string): svarId is SvarJaNei =>
    svarId === 'JA' || svarId === 'NEI';

export const erFaktaOffentligTransport = (
    fakta: FaktaReiseTilSamling
): fakta is FaktaOffentligTransport => fakta.type === 'OFFENTLIG_TRANSPORT';

export const erFaktaPrivatBil = (fakta: FaktaReiseTilSamling): fakta is FaktaPrivatBil =>
    fakta.type === 'PRIVAT_BIL';

export const erFaktaDrosje = (fakta: FaktaReiseTilSamling): fakta is FaktaDrosje =>
    fakta.type === 'DROSJE';

export const typeReiseTilSamlingTilTypeVilkårFakta: Record<TypeReiseTilSamling, TypeVilkårFakta> = {
    OFFENTLIG_TRANSPORT: 'REISE_TIL_SAMLING_OFFENTLIG_TRANSPORT',
    PRIVAT_BIL: 'REISE_TIL_SAMLING_PRIVAT_BIL',
    DROSJE: 'REISE_TIL_SAMLING_DROSJE',
    UBESTEMT: 'REISE_TIL_SAMLING_UBESTEMT',
};
