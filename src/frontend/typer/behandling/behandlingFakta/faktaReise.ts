import { JaNei } from '../../common';

export interface FaktaReise {
    reiseAdresse: ReiseAdresse;
    dagerPerUke: ValgtAktivitetDagligReise;
    harMerEnn6KmReisevei: JaNei;
    lengdeReisevei: number;
    harBehovForTransportUavhengigAvReisensLengde?: JaNei;
    kanReiseMedOffentligTransport: JaNei;
    offentligTransport?: OffentligTransport;
    privatTransport?: PrivatTransport;
}
export interface ReiseAdresse {
    gateadresse: string;
    postnummer: string;
    poststed: string;
}
export interface OffentligTransport {
    billettTyperValgt: BillettType[];
    enkeltbillettPris?: number;
    syvdagersbillettPris?: number;
    månedskortPris?: number;
}
export interface PrivatTransport {
    årsakIkkeOffentligTransport: ÅrsakIkkeOffentligTransport;
    kanKjøreMedEgenBil?: JaNei;
    utgifterBil?: UtgifterBil;
    utgifterTaxi?: UtgifterTaxi;
}
export interface ValgtAktivitetDagligReise {
    id: string;
    label: string;
}

export enum BillettType {
    ENKELTBILLETT = 'ENKELTBILLETT',
    SYVDAGERSBILLETT = 'SYVDAGERSBILLETT',
    TRETTIDAGERSBILLETT = 'TRETTIDAGERSBILLETT',
}
export enum ÅrsakIkkeOffentligTransport {
    HELSEMESSIGE_ÅRSAKER = 'HELSEMESSIGE_ÅRSAKER',
    DÅRLIG_TRANSPORTTILBUD = 'DÅRLIG_TRANSPORTTILBUD',
    LEVERING_HENTING_BARNEHAGE_SKOLE = 'LEVERING_HENTING_BARNEHAGE_SKOLE',
    ANNET = 'ANNET',
}
export interface UtgifterBil {
    parkering?: number;
    bompenger?: number;
    ferge?: number;
    piggdekkavgift?: number;
}
export interface UtgifterTaxi {
    årsakIkkeKjøreBil: ÅrsakIkkeKjøreBil;
    ønskerSøkeOmTaxi: JaNei;
}
export enum ÅrsakIkkeKjøreBil {
    HELSEMESSIGE_ÅRSAKER = 'HELSEMESSIGE_ÅRSAKER',
    DÅRLIG_TRANSPORTTILBUD = 'DÅRLIG_TRANSPORTTILBUD',
    ANNET = 'ANNET',
}
export const ÅrsakIkkeOffentligTransportTilTekst: Record<ÅrsakIkkeOffentligTransport, string> = {
    HELSEMESSIGE_ÅRSAKER: 'Helsemessige årsaker',
    DÅRLIG_TRANSPORTTILBUD: 'Dårlig transporttilbud',
    LEVERING_HENTING_BARNEHAGE_SKOLE: 'Levering eller henting  barnehage/skole',
    ANNET: 'Annet',
};
export const BillettTypeTilTekst: Record<BillettType, string> = {
    ENKELTBILLETT: 'Enkeltbillett',
    SYVDAGERSBILLETT: '7-dagersbillett',
    TRETTIDAGERSBILLETT: '30-dagersbillett',
};
export const ÅrsakIkkeKjøreBilTilTekst: Record<ÅrsakIkkeKjøreBil, string> = {
    HELSEMESSIGE_ÅRSAKER: 'Helsemessige årsaker',
    DÅRLIG_TRANSPORTTILBUD: 'Dårlig transporttilbud',
    ANNET: 'Annet',
};
