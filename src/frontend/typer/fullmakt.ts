export interface FullmektigDto {
    fullmektigIdent: string;
    fullmektigNavn?: string;
    gyldigFraOgMed: Date;
    gyldigTilOgMed?: Date;
    temaer: string[];
}
