import { TypeVilkårFakta } from './regelstrukturReiseOppstartAvslutningHjemreise';
import { TypeReiseOppstartAvslutningHjemreise } from './vilkårReiseOppstartAvslutningHjemreise';

export interface FaktaReiseOppstartAvslutningHjemreise {
    type: TypeReiseOppstartAvslutningHjemreise;
}

export interface FaktaOffentligTransport extends FaktaReiseOppstartAvslutningHjemreise {
    type: 'OFFENTLIG_TRANSPORT';
    utgifterOffentligTransport: number | undefined;
    aktivitetId: string;
    aktivitetType: string;
}

export interface FaktaPrivatBil extends FaktaReiseOppstartAvslutningHjemreise {
    type: 'PRIVAT_BIL';
    reiseavstand: number | undefined;
    aktivitetId: string;
    aktivitetType: string;
    bompenger?: number;
    fergekostnad?: number;
}

export const erFaktaOffentligTransport = (
    fakta: FaktaReiseOppstartAvslutningHjemreise
): fakta is FaktaOffentligTransport => fakta.type === 'OFFENTLIG_TRANSPORT';

export const erFaktaPrivatBil = (
    fakta: FaktaReiseOppstartAvslutningHjemreise
): fakta is FaktaPrivatBil => fakta.type === 'PRIVAT_BIL';

/**
 * Henter aktivitetId fra fakta dersom typen er bestemt (offentlig transport eller privat bil). Reiser med
 * fakta-type Ubestemt har ingen aktivitetId, og hentes derfor aldri fra backend i utgangspunktet (se
 * ReiseOppstartAvslutningHjemreiseVilkårService.hentVilkårGruppertPåAktivitet i backend).
 */
export const finnAktivitetIdForFakta = (
    fakta: FaktaReiseOppstartAvslutningHjemreise
): string | undefined => {
    if (erFaktaOffentligTransport(fakta) || erFaktaPrivatBil(fakta)) {
        return fakta.aktivitetId;
    }
    return undefined;
};

export const typeReiseOppstartAvslutningHjemreiseTilTypeVilkårFakta: Record<
    TypeReiseOppstartAvslutningHjemreise,
    TypeVilkårFakta
> = {
    OFFENTLIG_TRANSPORT: 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_OFFENTLIG_TRANSPORT',
    PRIVAT_BIL: 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_PRIVAT_BIL',
    UBESTEMT: 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_UBESTEMT',
};
