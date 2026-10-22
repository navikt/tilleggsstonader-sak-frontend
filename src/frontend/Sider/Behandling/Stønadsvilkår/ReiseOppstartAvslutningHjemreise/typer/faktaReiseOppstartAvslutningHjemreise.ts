import { TypeVilkårFakta } from './regelstrukturReiseOppstartAvslutningHjemreise';
import { TypeReiseOppstartAvslutningHjemreise } from './vilkårReiseOppstartAvslutningHjemreise';

export interface FaktaReiseOppstartAvslutningHjemreise {
    type: TypeReiseOppstartAvslutningHjemreise;
}

export interface FaktaOffentligTransport extends FaktaReiseOppstartAvslutningHjemreise {
    type: 'OFFENTLIG_TRANSPORT';
    utgifterOffentligTransport: number | undefined;
    begrunnelse?: string;
}

export interface FaktaPrivatBil extends FaktaReiseOppstartAvslutningHjemreise {
    type: 'PRIVAT_BIL';
    begrunnelse?: string;

    reiseavstand: number | undefined;
    bompenger?: number;
    fergekostnad?: number;
    parkering?: number;
    piggdekkavgift?: number;
}

export const erFaktaOffentligTransport = (
    fakta: FaktaReiseOppstartAvslutningHjemreise
): fakta is FaktaOffentligTransport => fakta.type === 'OFFENTLIG_TRANSPORT';

export const erFaktaPrivatBil = (
    fakta: FaktaReiseOppstartAvslutningHjemreise
): fakta is FaktaPrivatBil => fakta.type === 'PRIVAT_BIL';

export const typeReiseOppstartAvslutningHjemreiseTilTypeVilkårFakta: Record<
    TypeReiseOppstartAvslutningHjemreise,
    TypeVilkårFakta
> = {
    OFFENTLIG_TRANSPORT: 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_OFFENTLIG_TRANSPORT',
    PRIVAT_BIL: 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_PRIVAT_BIL',
    UBESTEMT: 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_UBESTEMT',
};
