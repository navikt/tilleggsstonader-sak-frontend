import { SelectOption } from '../komponenter/Skjema/SelectMedOptions';

export interface Kodeverk {
    kode: string;
    beskrivelse: string;
}

export function kodeverkTilOptions(kodeverk: Kodeverk[]): SelectOption[] {
    return kodeverk.map((kodeverk) => ({
        value: kodeverk.kode,
        label: kodeverk.beskrivelse,
    }));
}

/**
 * Bygger select-options fra et kodeverk, og sørger for at `gjeldendeValgt` (f.eks. en tiltaksvariant
 * hentet fra Arena) alltid finnes som et alternativ i lista - selv om den ikke er en del av det
 * "kjente" kodeverket (f.eks. tiltaksvarianter som ikke er mappet til en utbetalingstype). Uten dette
 * vil en <select> vise "Velg" i stedet for den faktiske verdien når value ikke matcher noen option.
 */
export function kodeverkTilOptionsMedGjeldendeValgt(
    kodeverk: Kodeverk[],
    gjeldendeValgt?: Kodeverk
): SelectOption[] {
    if (!gjeldendeValgt || kodeverk.some((it) => it.kode === gjeldendeValgt.kode)) {
        return kodeverkTilOptions(kodeverk);
    }
    return kodeverkTilOptions([...kodeverk, gjeldendeValgt]);
}

export function optionTilKodeverk(kodeverk: Kodeverk[], option: string): Kodeverk | undefined {
    return kodeverk.find((it) => it.kode == option);
}
