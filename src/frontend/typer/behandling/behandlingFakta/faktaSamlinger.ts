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
    // offentligTransport?: OffentligTransport;
    // privatTransport?: PrivatTransport;
}

export interface ReiseAdresse {
    gateadresse: string;
    postnummer: string;
    poststed: string;
}

// export interface OffentligTransport {}
