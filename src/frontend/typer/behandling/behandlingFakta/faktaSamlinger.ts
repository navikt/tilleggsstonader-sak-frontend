import { Periode } from '../../../utils/periode';
import { JaNei } from '../../common';

export interface FaktaSamling {
    skalReiseFraFolkeregistrertAdresse?: JaNei;
    adresseDetSkalReisesFra: ReiseAdresse;
    reiseAdresse: ReiseAdresse;
    periode: Periode;
    harMerEnn30KmReisevei: JaNei;
    lengdeReisevei: number;
    // leveringOgHentingIBarnehage?: LeveringOgHentingIBarnehage;
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
    utgifterOffentligTransport: number;
}

export interface PrivatTransport {
    årsakIkkeOffentligTransport: ÅrsakIkkeOffentligTransport[];
    kanKjøreMedEgenBil?: JaNei;
    utgifterBil?: UtgifterBil;
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
    fergekostnad?: number;
    piggdekkavgift?: number;
}

export const ÅrsakIkkeOffentligTransportTilTekst: Record<ÅrsakIkkeOffentligTransport, string> = {
    HELSEMESSIGE_ÅRSAKER: 'Helsemessige årsaker',
    DÅRLIG_TRANSPORTTILBUD: 'Dårlig transporttilbud',
    LEVERING_HENTING_BARNEHAGE_SKOLE: 'Levering/henting i barnehage eller skole',
    ANNET: 'Annet',
};

export function reiseAdresseTilTekst(adresse: ReiseAdresse): string {
    return `${adresse.gateadresse}, ${adresse.postnummer} ${adresse.poststed}`;
}
