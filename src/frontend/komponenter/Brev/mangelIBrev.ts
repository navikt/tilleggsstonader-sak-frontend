import { Delmal, MalStruktur, Valg, Valgfelt, Variabel } from './typer';
import { harIkkeVerdi } from '../../utils/utils';

export const defaultMangelIBrev: MangelIBrev = {
    delmaler: [],
    variabler: [],
    valgfelt: [],
};

export interface MangelIBrev {
    delmaler: string[];
    variabler: Variabel[];
    valgfelt: Valgfelt[];
}

export const harMangel = (mangelIBrev: MangelIBrev) => {
    return mangelIBrev.variabler.length > 0;
};

export const finnMangelIBrev = (
    mal: MalStruktur,
    inkluderteDelmaler: Record<string, boolean>,
    valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>,
    variabler: Partial<Record<string, string>>
): MangelIBrev => {
    const malerSomErInkludert = mal.delmaler.filter((delmal) => inkluderteDelmaler[delmal._id]);
    const variablerMedMangel = finnMangeldeVariabler(malerSomErInkludert, valgfelt, variabler);
    const valgfeltMedMangel = finnManglendeValgfelt(malerSomErInkludert, valgfelt);

    return {
        delmaler: variablerMedMangel.delmaler.concat(valgfeltMedMangel.delmaler),
        variabler: variablerMedMangel.variabler,
        valgfelt: valgfeltMedMangel.valgfelt,
    };
};

function finnManglendeValgfelt(
    delmaler: Delmal[],
    valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>
) {
    const delmalerMedMangel: string[] = [];
    const valgfeltUtenValg = delmaler.flatMap((delmal) => {
        const valgfeltForDelmal = valgfelt[delmal._id] ?? {};
        const valgfeltUtenValg = delmal.blocks
            .filter((block) => block._type === 'valgfelt')
            .filter((block) => block.erPakrevd)
            .filter((valg) => !valgfeltForDelmal[valg._id]);
        if (valgfeltUtenValg.length > 0) {
            delmalerMedMangel.push(delmal._id);
        }
        return valgfeltUtenValg;
    });
    return {
        delmaler: delmalerMedMangel,
        valgfelt: valgfeltUtenValg,
    };
}

function finnMangeldeVariabler(
    delmaler: Delmal[],
    valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>,
    variabler: Partial<Record<string, string>>
): { delmaler: string[]; variabler: Variabel[] } {
    const delmalerMedMangel: string[] = [];

    const variablerMedMangel = delmaler.flatMap((delmal) => {
        const alleVariabler = finnMangeldeVariablerForMal(delmal, valgfelt, variabler);
        if (alleVariabler.length > 0) {
            delmalerMedMangel.push(delmal._id);
        }
        return alleVariabler;
    });

    return { delmaler: delmalerMedMangel, variabler: variablerMedMangel };
}

function finnMangeldeVariablerForMal(
    delmal: Delmal,
    valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>,
    variabler: Partial<Record<string, string>>
) {
    const valgForDelmal = Object.values(valgfelt[delmal._id] ?? {});

    const variablerIValg = valgForDelmal
        .filter((valg) => valg._type === 'tekst')
        .flatMap((valg) => valg.variabler);
    const variablerIDelmal = delmal.blocks
        .filter((block) => block._type === 'block')
        .flatMap((block) => block.markDefs)
        .filter((mark) => mark._type === 'variabel');

    return variablerIValg
        .concat(variablerIDelmal)
        .filter((variabel) => harIkkeVerdi(variabler[variabel._id]));
}
