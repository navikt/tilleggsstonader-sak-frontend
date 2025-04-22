import { JaNei } from '../../common';

export interface FaktaBoligEllerOvernatting {
    søknadsgrunnlag?: FaktaBoligEllerOvernattingSøknadsgrunnlag;
}

interface FaktaBoligEllerOvernattingSøknadsgrunnlag {
    fasteUtgifter?: FaktaFasteUtgifter;
    samling?: FaktaUtgifterIForbindelseMedSamling;
    harSærligStoreUtgifterPgaFunksjonsnedsettelse: JaNei;
}

export interface FaktaFasteUtgifter {
    utgifterFlereSteder?: FaktaUtgifterFlereSteder;
    utgifterNyBolig?: FaktaUtgifterNyBolig;
}

export interface FaktaUtgifterFlereSteder {
    delerBoutgifter: DelerUtgifterFlereStederType[];
    andelUtgifterBoligHjemsted: number;
    andelUtgifterBoligAktivitetssted: number;
}

export interface FaktaUtgifterNyBolig {
    delerBoutgifter: JaNei;
    andelUtgifterBolig?: number;
    harHoyereUtgifterPaNyttBosted: JaNei;
    mottarBostotte: JaNei;
}

export interface FaktaUtgifterIForbindelseMedSamling {
    periodeForSamling: PeriodeForSamling[];
}

interface PeriodeForSamling {
    fom: string;
    tom: string;
    trengteEkstraOvernatting: JaNei;
    utgifterTilOvernatting: number;
}

enum DelerUtgifterFlereStederType {
    HJEMSTED = 'HJEMSTED',
    AKTIVITETSSTED = 'AKTIVITETSSTED',
    NEI = 'NEI',
}

export const delerUtgifterFlereStederTypeTilTekst: Record<DelerUtgifterFlereStederType, string> = {
    HJEMSTED: 'Hjemsted',
    AKTIVITETSSTED: 'Aktivitetsted',
    NEI: 'Nei',
};
