import type { NødvendigUtgift } from '../../../../../typer/nødvendigUtgift';

export type TypeVilkårFaktaFlytting =
    'FLYTTING_FLYTTEBYRÅ' | 'FLYTTING_FLYTTE_SELV' | 'FLYTTING_UBESTEMT';

export interface FaktaFlyttingFlyttebyrå {
    type: 'FLYTTING_FLYTTEBYRÅ';
    adresse: string | null;
    tilbud: FaktaFlyttingTilbud[];
    erUtgifterDokumentert: boolean;
    nødvendigUtgift: NødvendigUtgift;
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
    leiebil: number | null;
    bompenger: number | null;
    ferge: number | null;
    parkering: number | null;
    annet: number | null;
    erUtgifterDokumentert: boolean;
    nødvendigUtgift: NødvendigUtgift;
}

export interface FaktaFlyttingUbestemt {
    type: 'FLYTTING_UBESTEMT';
    adresse: string | null;
}

export type FaktaFlytting =
    FaktaFlyttingFlyttebyrå | FaktaFlyttingKjøreSelv | FaktaFlyttingUbestemt;

export const flyttingFaktaFeltTilTekst = {
    henger: 'Hengerleie',
    leiebil: 'Leiebil',
    bompenger: 'Bompenger',
    ferge: 'Ferge',
    parkering: 'Parkering',
    annet: 'Annet',
} as const;
