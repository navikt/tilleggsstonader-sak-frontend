import { Periode } from '../../../utils/periode';
import { JaNei } from '../../common';

export interface FaktaReise {
    skalReiseFraFolkeregistrertAdresse: JaNei;
    adresseDetSkalReisesFra: ReiseAdresse;
    reiseAdresse: ReiseAdresse;
    periode: Periode;
    dagerPerUke: string;
    harMerEnn6KmReisevei: JaNei;
    lengdeReisevei: number;
    harBehovForTransportUavhengigAvReisensLengde?: JaNei;
    kanReiseMedOffentligTransport: SvarKanReiseMedOffentligTransport;
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
    årsakIkkeOffentligTransport: ÅrsakIkkeOffentligTransport[];
    kanKjøreMedEgenBil?: JaNei;
    utgifterBil?: UtgifterBil;
    taxi?: Taxi;
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
    parkering: JaNei;
    bompenger?: number;
    ferge?: number;
    piggdekkavgift?: number;
    destinasjonEgenBil?: DestinasjonEgenBil[];
    mottarGrunnstønad?: JaNei;
    reisedistanseEgenBil: number;
}

export interface Taxi {
    årsakIkkeKjøreBil: ÅrsakIkkeKjøreBil[];
    ønskerSøkeOmTaxi: JaNei;
    ttkort?: JaNei;
}

export enum DestinasjonEgenBil {
    TOGSTASJON = 'TOGSTAJON',
    BUSSSTOPP = 'BUSSSTOPP',
    FERGE_BAT_KAI = 'FERGE_BÅT_KAI',
}
export enum ÅrsakIkkeKjøreBil {
    HELSEMESSIGE_ÅRSAKER = 'HELSEMESSIGE_ÅRSAKER',
    HAR_IKKE_BIL_FØRERKORT = 'HAR_IKKE_BIL_FØRERKORT',
    ANNET = 'ANNET',
}
export enum SvarKanReiseMedOffentligTransport {
    JA = 'JA',
    NEI = 'NEI',
    KOMBINERT_BIL_OFFENTLIG_TRANSPORT = 'KOMBINERT_BIL_OFFENTLIG_TRANSPORT',
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
    HAR_IKKE_BIL_FØRERKORT: 'Har ikke bil eller førerkort',
    ANNET: 'Annet',
};

export const SvarKanReiseMedOffentligTransportTilTekst: Record<
    SvarKanReiseMedOffentligTransport,
    string
> = {
    JA: 'Ja',
    NEI: 'Nei',
    KOMBINERT_BIL_OFFENTLIG_TRANSPORT:
        'Jeg må kombinere offentlig transport med kjøring av egen bil',
};

export function reiseAdresseTilTekst(adresse: ReiseAdresse) {
    return `${adresse.gateadresse} ${adresse.postnummer} ${adresse.poststed}`;
}
