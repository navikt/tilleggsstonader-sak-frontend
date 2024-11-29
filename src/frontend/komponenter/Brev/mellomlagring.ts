import { Fritekst, FritekstAvsnitt, Tekst } from './typer';

export interface MellomlagretBrevDto {
    brevverdier: string;
    brevmal: string;
}

export interface IBrevverdier {
    inkluderteDelmaler?: Record<string, boolean>;
    fritekst?: Partial<Record<string, Record<string, FritekstAvsnitt[] | undefined>>>;
    valgfelt?: Partial<Record<string, Record<string, Fritekst | Tekst>>>;
    variabler?: Partial<Record<string, string>>;
}

export function parseMellomlagretBrev(mellomlagretBrev: MellomlagretBrevDto | undefined) {
    const {
        inkluderteDelmaler: mellomlagredeInkluderteDelmaler = undefined,
        fritekst: mellomlagredeFritekstfelt = undefined,
        valgfelt: mellomlagredeValgfelt = undefined,
        variabler: mellomlagredeVariabler = undefined,
    } = mellomlagretBrev ? (JSON.parse(mellomlagretBrev?.brevverdier) as IBrevverdier) : {};
    return {
        mellomlagredeInkluderteDelmaler,
        mellomlagredeFritekstfelt,
        mellomlagredeValgfelt,
        mellomlagredeVariabler,
    };
}
