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

export function optionTilKodeverk(kodeverk: Kodeverk[], option: string): Kodeverk | undefined {
    return kodeverk.find((it) => it.kode == option);
}
