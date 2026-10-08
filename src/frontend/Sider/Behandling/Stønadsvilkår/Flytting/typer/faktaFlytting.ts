export type TypeVilkårFaktaFlytting =
    'FLYTTING_FLYTTEBYRÅ' | 'FLYTTING_FLYTTE_SELV' | 'FLYTTING_UBESTEMT';

export interface FaktaFlyttingFlyttebyrå {
    type: 'FLYTTING_FLYTTEBYRÅ';
    adresse: string | null;
    tilbud1: FaktaFlyttingTilbud;
    tilbud2: FaktaFlyttingTilbud;
    erBetalingDokumentert: boolean;
}

export interface FaktaFlyttingTilbud {
    navn: string | null;
    pris: number | null;
}

export interface FaktaFlyttingKjøreSelv {
    type: 'FLYTTING_FLYTTE_SELV';
    adresse: string | null;
    avstandEnVei: number | null;
    henger: number | null;
    bompenger: number | null;
    ferge: number | null;
    parkering: number | null;
}

export interface FaktaFlyttingUbestemt {
    type: 'FLYTTING_UBESTEMT';
    adresse: string | null;
}

export type FaktaFlytting =
    FaktaFlyttingFlyttebyrå | FaktaFlyttingKjøreSelv | FaktaFlyttingUbestemt;

export const flyttingFaktaFeltTilTekst = {
    henger: 'Hengerleie',
    bompenger: 'Bompenger',
    ferge: 'Ferge',
    parkering: 'Parkering',
} as const;
