import { Drivstofftype, drivstofftypeTilTekst, ReiseAdresse } from './faktaReise';
import { JaNei } from '../../common';

export { Drivstofftype, drivstofftypeTilTekst };
export type { ReiseAdresse };

export interface FaktaSamling {
    fom: string;
    tom: string;
    erObligatorisk: JaNei;
    adresse: ReiseAdresse;
    antallKilometerEnVei: string;
    reisemåte?: FaktaReisemåte;
}

export interface FaktaReisemåte {
    hvilkeTransportmidlerBleBenyttet?: Transportmiddel[];
    årsakIkkeOffentligTransport?: FaktaUnntakFraOffentligTransport;
    årsakIkkePrivatBil?: ÅrsakKanIkkeBenyttePrivatBil[];
    offentligTransport?: FaktaOffentligTransportInfo;
    privatBil?: FaktaPrivatBilInfo;
    drosje?: FaktaDrosjeInfo;
}

export interface FaktaOffentligTransportInfo {
    totalUtgifterOffentligTransport?: string;
}

export interface FaktaPrivatBilInfo {
    benyttetEgenBil?: JaNei;
    betalteForReisen?: JaNei;
    infoBilKunDelerAvStrekning?: FaktaInfoBilKunDelerAvStrekning;
    utgifterPrivatBil?: FaktaUtgifterPrivatBil;
}

export interface FaktaInfoBilKunDelerAvStrekning {
    strekningHvorBilBleBenyttet?: string;
    antallKilometerKjørt?: string;
}

export interface FaktaUtgifterPrivatBil {
    bompenger?: string;
    ferge?: string;
    piggdekkavgift?: string;
    parkering?: string;
    drivstoffType?: Drivstofftype;
}

export interface FaktaDrosjeInfo {
    harTTKort?: JaNei;
}

export interface FaktaUnntakFraOffentligTransport {
    årsaker?: ÅrsakKanIkkeBenytteOffentligTransport[];
    leveringOgHentingIBarnehage?: FaktaLeveringOgHentingIBarnehage;
}

export interface FaktaLeveringOgHentingIBarnehage {
    gateadresse?: string;
    postnummer?: string;
}

export enum Transportmiddel {
    OFFENTLIG_TRANSPORT = 'OFFENTLIG_TRANSPORT',
    PRIVAT_BIL = 'PRIVAT_BIL',
    DROSJE = 'DROSJE',
}

export const transportmiddelTilTekst: Record<Transportmiddel, string> = {
    OFFENTLIG_TRANSPORT: 'Offentlig transport',
    PRIVAT_BIL: 'Privat bil',
    DROSJE: 'Drosje',
};

export enum ÅrsakKanIkkeBenytteOffentligTransport {
    DÅRLIG_TRANSPORTTILBUD = 'DÅRLIG_TRANSPORTTILBUD',
    HELSEMESSIGE_ÅRSAKER = 'HELSEMESSIGE_ÅRSAKER',
    LEVERING_HENTING_I_BARNEHAGE = 'LEVERING_HENTING_I_BARNEHAGE',
    FRAKT_AV_NØDVENDIG_UTSTYR = 'FRAKT_AV_NØDVENDIG_UTSTYR',
}

export const årsakKanIkkeBenytteOffentligTransportTilTekst: Record<
    ÅrsakKanIkkeBenytteOffentligTransport,
    string
> = {
    DÅRLIG_TRANSPORTTILBUD: 'Dårlig transporttilbud',
    HELSEMESSIGE_ÅRSAKER: 'Helsemessige årsaker',
    LEVERING_HENTING_I_BARNEHAGE: 'Levering/henting i barnehage',
    FRAKT_AV_NØDVENDIG_UTSTYR: 'Frakt av nødvendig utstyr',
};

export enum ÅrsakKanIkkeBenyttePrivatBil {
    HAR_IKKE_BIL_ELLER_FØRERKORT = 'HAR_IKKE_BIL_ELLER_FØRERKORT',
    HELSEMESSIGE_ÅRSAKER = 'HELSEMESSIGE_ÅRSAKER',
    FRAKT_AV_NØDVENDIG_UTSTYR = 'FRAKT_AV_NØDVENDIG_UTSTYR',
    ANNET = 'ANNET',
}

export const årsakKanIkkeBenytteEgenBilTilTekst: Record<ÅrsakKanIkkeBenyttePrivatBil, string> = {
    HAR_IKKE_BIL_ELLER_FØRERKORT: 'Har ikke bil eller førerkort',
    HELSEMESSIGE_ÅRSAKER: 'Helsemessige årsaker',
    FRAKT_AV_NØDVENDIG_UTSTYR: 'Frakt av nødvendig utstyr',
    ANNET: 'Annet',
};
