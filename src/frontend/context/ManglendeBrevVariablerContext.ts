import { useState } from 'react';

import constate from 'constate';

import { MalStruktur, Valg, Valgfelt } from '../komponenter/Brev/typer';
import { harIkkeVerdi } from '../utils/utils';

export const [ManglendeBrevVariablerProvider, useManglendeBrevVariabler] = constate(() => {
    const [manglendeBrevVariabler, settManglendeBrevVariabler] = useState<string[]>([]);

    const finnManglendeBrevVariabler = (
        mal: MalStruktur,
        inkluderteDelmaler: Record<string, boolean>,
        valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>,
        variabler: Partial<Record<string, string>>
    ): string[] => {
        return mal.delmaler
            .filter((delmal) => inkluderteDelmaler[delmal._id])
            .flatMap((delmal) => Object.values(valgfelt[delmal._id] ?? {}))
            .filter((valg) => valg._type === 'tekst')
            .flatMap((valg) => valg.variabler)
            .map((variabel) => variabel._id)
            .filter((variabelId) => harIkkeVerdi(variabler[variabelId]));
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

    return {
        manglendeBrevVariabler,
        oppdaterManglendeBrevVariabler,
    };
});
