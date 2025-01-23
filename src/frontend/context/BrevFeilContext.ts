import { useState } from 'react';

import constate from 'constate';

import { Delmal, MalStruktur, Valg, Valgfelt, Variabel } from '../komponenter/Brev/typer';
import { variabelBeregningstabellId } from '../komponenter/Brev/variablerUtils';
import { harIkkeVerdi } from '../utils/utils';

/**
 * Htmlvariabler populeres kun når man genrerer selve brevet og ligger ikke i et state
 * Må filtreres vekk fra variabler fra delmalen for å unngå at man får treff på vedtakstabellen
 */
const htmlVariabler = new Set([variabelBeregningstabellId]);

export const [BrevFeilContextProvider, useBrevFeilContext] = constate(() => {
    const [manglendeBrevVariabler, settManglendeBrevVariabler] = useState<Variabel[]>([]);

    const finnManglendeBrevVariabler = (
        delmaler: Delmal[],
        valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>,
        variabler: Partial<Record<string, string>>
    ): Variabel[] => {
        return delmaler.flatMap((delmal) => {
            const valgForDelmal = Object.values(valgfelt[delmal._id] ?? {});

            const variablerIValg = valgForDelmal
                .filter((valg) => valg._type === 'tekst')
                .flatMap((valg) => valg.variabler);

            const variablerIDelmal = delmal.blocks
                .filter((block) => block._type === 'block')
                .flatMap((block) => block.markDefs)
                .filter((mark) => mark._type === 'variabel')
                .filter((mark) => !htmlVariabler.has(mark._id));

            return [...variablerIValg, ...variablerIDelmal].filter((variabel) =>
                harIkkeVerdi(variabler[variabel._id])
            );
        });
    };

    const oppdaterMangelIBrev = (
        mal: MalStruktur,
        inkluderteDelmaler: Record<string, boolean>,
        valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>,
        variabler: Partial<Record<string, string>>
    ): 'HAR_MANGEL' | 'HAR_IKKE_MANGEL' => {
        const valgteDelmaler = mal.delmaler.filter((delmal) => inkluderteDelmaler[delmal._id]);
        const mangler = finnManglendeBrevVariabler(valgteDelmaler, valgfelt, variabler);
        settManglendeBrevVariabler(mangler);
        return mangler.length > 0 ? 'HAR_MANGEL' : 'HAR_IKKE_MANGEL';
    };

    return {
        manglendeBrevVariabler,
        oppdaterMangelIBrev,
    };
});
