import { useMemo, useState } from 'react';

import constate from 'constate';

import { Delmal, MalStruktur, Valg, Valgfelt, Variabel } from '../komponenter/Brev/typer';
import { variabelBeregningstabellId } from '../komponenter/Brev/variablerUtils';
import { harIkkeVerdi } from '../utils/utils';

/**
 * Htmlvariabler populeres kun når man genrerer selve brevet og ligger ikke i et state
 * Må filtreres vekk fra variabler fra delmalen for å unngå at man får treff på vedtakstabellen
 */
const htmlVariabler = new Set([variabelBeregningstabellId]);

export type FeilIDelmalType = Variabel | Valgfelt;

export interface FeilIDelmal<T extends FeilIDelmalType> {
    delmalId: string;
    mangler: T[];
}

export const [BrevFeilContextProvider, useBrevFeilContext] = constate(() => {
    const [manglendeBrevVariabler, settManglendeBrevVariabler] = useState<FeilIDelmal<Variabel>[]>(
        []
    );
    const [manglendeValgfelt, settManglendeValgfelt] = useState<FeilIDelmal<Valgfelt>[]>([]);
    const [visMangler, settVisMangler] = useState<boolean>(false);

    const finnManglendeBrevVariabler = (
        delmaler: Delmal[],
        valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>,
        variabler: Partial<Record<string, string>>
    ): FeilIDelmal<Variabel>[] => {
        return delmaler
            .flatMap((delmal) => {
                const valgForDelmal = Object.values(valgfelt[delmal._id] ?? {});

                const variablerIValg = valgForDelmal
                    .filter((valg) => valg._type === 'tekst')
                    .flatMap((valg) => valg.variabler);

                const variablerIDelmal = delmal.blocks
                    .filter((block) => block._type === 'block')
                    .flatMap((block) => block.markDefs)
                    .filter((mark) => mark._type === 'variabel')
                    .filter((mark) => !htmlVariabler.has(mark._id));

                const alleManglerIDelmal = [...variablerIValg, ...variablerIDelmal].filter(
                    (variabel) => harIkkeVerdi(variabler[variabel._id])
                );
                return { delmalId: delmal._id, mangler: alleManglerIDelmal };
            })
            .filter((feil) => feil.mangler.length > 0);
    };

    const finnManglendeValgfelt = (
        delmaler: Delmal[],
        valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>
    ): FeilIDelmal<Valgfelt>[] => {
        return delmaler
            .flatMap((delmal) => {
                const valgfeltForDelmal = valgfelt[delmal._id] ?? {};
                const mangler = delmal.blocks
                    .filter((block) => block._type === 'valgfelt')
                    .filter((block) => block.erPakrevd)
                    .filter((valg) => !valgfeltForDelmal[valg._id]);
                return {
                    delmalId: delmal._id,
                    mangler: mangler,
                };
            })
            .filter((feil) => feil.mangler.length > 0);
    };

    const oppdaterMangelIBrev = (
        mal: MalStruktur,
        inkluderteDelmaler: Record<string, boolean>,
        valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>,
        variabler: Partial<Record<string, string>>
    ) => {
        const valgteDelmaler = mal.delmaler.filter((delmal) => inkluderteDelmaler[delmal._id]);
        settManglendeBrevVariabler(finnManglendeBrevVariabler(valgteDelmaler, valgfelt, variabler));
        settManglendeValgfelt(finnManglendeValgfelt(valgteDelmaler, valgfelt));
    };

    /**
     * Grupperer mangler per delmal for å enklere kunne sjekke om en komponent i en delmal har mangel
     */
    const manglerPerDelmal = useMemo(() => {
        return [...manglendeValgfelt, ...manglendeBrevVariabler].reduce(
            (prev, current) => {
                const previousValues = prev[current.delmalId] ?? [];
                prev[current.delmalId] = new Set([
                    ...previousValues,
                    ...current.mangler.map((mangel) => mangel._id),
                ]);
                return prev;
            },
            {} as Record<string, Set<string>>
        );
    }, [manglendeValgfelt, manglendeBrevVariabler]);

    const harMangelForKomponent = (delmalId: string, komponentId: string) =>
        visMangler && manglerPerDelmal[delmalId]?.has(komponentId);

    const brevHarMangler = manglendeBrevVariabler.length > 0 || manglendeValgfelt.length > 0;

    return {
        settVisMangler,
        manglendeBrevVariabler,
        manglendeValgfelt,
        oppdaterMangelIBrev,
        brevHarMangler,
        harMangelForKomponent,
    };
});
