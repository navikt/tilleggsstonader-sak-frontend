import { useState } from 'react';

import constate from 'constate';

import { MalStruktur, Valg, Valgfelt, Variabel } from '../komponenter/Brev/typer';
import { harIkkeVerdi } from '../utils/utils';

export const [BrevFeilContextProvider, useBrevFeilContext] = constate(() => {
    const [manglendeBrevVariabler, settManglendeBrevVariabler] = useState<Variabel[]>([]);

    const finnManglendeBrevVariabler = (
        mal: MalStruktur,
        inkluderteDelmaler: Record<string, boolean>,
        valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>,
        variabler: Partial<Record<string, string>>
    ): Variabel[] => {
        return mal.delmaler
            .filter((delmal) => inkluderteDelmaler[delmal._id])
            .flatMap((delmal) => {
                const valgForDelmal = Object.values(valgfelt[delmal._id] ?? {});

                const variablerIValg = valgForDelmal
                    .filter((valg) => valg._type === 'tekst')
                    .flatMap((valg) => valg.variabler);
                const variablerIDelmal = delmal.blocks
                    .filter((block) => block._type === 'block')
                    .flatMap((block) => block.markDefs)
                    .filter((mark) => mark._type === 'variabel');

                return [...variablerIValg, ...variablerIDelmal].filter((variabel) =>
                    harIkkeVerdi(variabler[variabel._id])
                );
            });
    };

    const oppdaterManglendeBrevVariabler = (
        mal: MalStruktur,
        inkluderteDelmaler: Record<string, boolean>,
        valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>,
        variabler: Partial<Record<string, string>>
    ) => {
        return settManglendeBrevVariabler(
            finnManglendeBrevVariabler(mal, inkluderteDelmaler, valgfelt, variabler)
        );
    };

    const brevMalManglerVariabler = manglendeBrevVariabler.length !== 0;

    return {
        manglendeBrevVariabler,
        oppdaterManglendeBrevVariabler,
        brevMalManglerVariabler,
    };
});
