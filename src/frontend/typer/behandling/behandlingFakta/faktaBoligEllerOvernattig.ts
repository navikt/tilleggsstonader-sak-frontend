import { JaNei } from '../../common';

export interface FaktaBoligEllerOvernatting {
    søknadsgrunnlag?: FaktaBoligEllerOvernattingSøknadsgrunnlag;
}

export interface FaktaBoligEllerOvernattingSøknadsgrunnlag {
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
    delerBoutgifter?: JaNei;
    delerBoutgifterNy?: DelerUtgifterFlereStederType[];
    andelUtgifterBolig?: number;
    harHoyereUtgifterPaNyttBosted: JaNei;
    mottarBostotte?: JaNei;
    andelUtgifterBoligHjemsted?: number;
    andelUtgifterBoligAktivitetssted?: number;
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

export enum DelerUtgifterFlereStederType {
    HJEMSTED = 'HJEMSTED',
    AKTIVITETSSTED = 'AKTIVITETSSTED',
    NEI = 'NEI',
}

export const delerUtgifterFlereStederTypeTilTekst: Record<DelerUtgifterFlereStederType, string> = {
    HJEMSTED: 'hjemsted',
    AKTIVITETSSTED: 'aktivitetssted',
    NEI: 'Nei',
};
