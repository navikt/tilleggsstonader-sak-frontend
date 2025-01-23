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

export const [BrevFeilContextProvider, useBrevFeilContext] = constate(() => {
    const [manglendeBrevVariabler, settManglendeBrevVariabler] = useState<Map<string, Variabel[]>>(
        new Map()
    );
    const [manglendeValgfelt, settManglendeValgfelt] = useState<Map<string, Valgfelt[]>>(new Map());

    const finnManglendeBrevVariabler = (
        delmaler: Delmal[],
        valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>,
        variabler: Partial<Record<string, string>>
    ): Map<string, Variabel[]> => {
        const map = new Map<string, Variabel[]>();

        delmaler.forEach((delmal) => {
            const valgForDelmal = Object.values(valgfelt[delmal._id] ?? {});

            const variablerIValg = valgForDelmal
                .filter((valg) => valg._type === 'tekst')
                .flatMap((valg) => valg.variabler);

            const variablerIDelmal = delmal.blocks
                .filter((block) => block._type === 'block')
                .flatMap((block) => block.markDefs)
                .filter((mark) => mark._type === 'variabel')
                .filter((mark) => !htmlVariabler.has(mark._id));

            const alleManglerIDelmal = [...variablerIValg, ...variablerIDelmal].filter((variabel) =>
                harIkkeVerdi(variabler[variabel._id])
            );
            if (alleManglerIDelmal.length > 0) {
                map.set(delmal._id, alleManglerIDelmal);
            }
        });
        return map;
    };

    const finnManglendeValgfelt = (
        delmaler: Delmal[],
        valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>
    ): Map<string, Valgfelt[]> => {
        const map = new Map<string, Valgfelt[]>();

        delmaler.forEach((delmal) => {
            const valgfeltForDelmal = valgfelt[delmal._id] ?? {};
            const mangler = delmal.blocks
                .filter((block) => block._type === 'valgfelt')
                .filter((block) => block.erPakrevd)
                .filter((valg) => !valgfeltForDelmal[valg._id]);
            if (mangler.length > 0) {
                map.set(delmal._id, mangler);
            }
        });
        return map;
    };

    const oppdaterMangelIBrev = (
        mal: MalStruktur,
        inkluderteDelmaler: Record<string, boolean>,
        valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>,
        variabler: Partial<Record<string, string>>
    ): 'HAR_MANGEL' | 'HAR_IKKE_MANGEL' => {
        const valgteDelmaler = mal.delmaler.filter((delmal) => inkluderteDelmaler[delmal._id]);
        const brevVariablerSomMangler = finnManglendeBrevVariabler(
            valgteDelmaler,
            valgfelt,
            variabler
        );
        settManglendeBrevVariabler(brevVariablerSomMangler);
        const valgfeltSomMangler = finnManglendeValgfelt(valgteDelmaler, valgfelt);
        settManglendeValgfelt(valgfeltSomMangler);
        return brevVariablerSomMangler.size > 0 || valgfeltSomMangler.size > 0
            ? 'HAR_MANGEL'
            : 'HAR_IKKE_MANGEL';
    };

    /**
     * Grupperer mangler per delmal for å enklere kunne sjekke om en komponent i en delmal har mangel
     */
    const manglerPerDelmal = useMemo(() => {
        return [...manglendeValgfelt, ...manglendeBrevVariabler].reduce(
            (prev, current) => {
                const delmalId = current[0];
                const tidligereMangler = prev[delmalId] ?? [];
                const nyeMangler = current[1];
                prev[delmalId] = new Set([
                    ...tidligereMangler,
                    ...nyeMangler.map((mangel) => mangel._id),
                ]);
                return prev;
            },
            {} as Record<string, Set<string>>
        );
    }, [manglendeValgfelt, manglendeBrevVariabler]);

    const manglerVerdi = (delmalId: string, komponentId: string) =>
        manglerPerDelmal[delmalId]?.has(komponentId);

    const nullstill = <T extends { _id: string }>(
        prevState: Map<string, T[]>,
        delmalId: string,
        komponentId: string
    ): Map<string, T[]> => {
        const newState = new Map<string, T[]>(prevState);

        const tidligereVerdier = newState.get(delmalId);
        if (tidligereVerdier) {
            const nyeVerdier: T[] = tidligereVerdier.filter((v) => v._id !== komponentId);

            if (nyeVerdier.length > 0) {
                newState.set(delmalId, nyeVerdier);
            } else {
                newState.delete(delmalId);
            }
        }

        return newState;
    };

    const nullstillValgfelt = (delmalId: string, komponentId: string) => {
        settManglendeValgfelt((prevState) => nullstill(prevState, delmalId, komponentId));
    };

    const nullstillVariabel = (delmalId: string, komponentId: string) => {
        settManglendeBrevVariabler((prevState) => nullstill(prevState, delmalId, komponentId));
    };

    const nullstillDelmal = (delmalId: string) => {
        settManglendeBrevVariabler((prevState) => {
            const newState = new Map<string, Variabel[]>(prevState);
            newState.delete(delmalId);
            return newState;
        });
        settManglendeValgfelt((prevState) => {
            const newState = new Map<string, Valgfelt[]>(prevState);
            newState.delete(delmalId);
            return newState;
        });
    };

    return {
        manglendeBrevVariabler,
        manglendeValgfelt,
        oppdaterMangelIBrev,
        manglerVerdi,
        nullstillValgfelt,
        nullstillVariabel,
        nullstillDelmal,
    };
});
