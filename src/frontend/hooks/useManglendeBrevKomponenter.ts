import { useState } from 'react';

import { MalStruktur, Valg, Valgfelt } from '../komponenter/Brev/typer';
import { harIkkeVerdi } from '../utils/utils';

function useManglendeBrevKomponenter() {
    const [manglendeBrevKomponenter, settManglendeBrevKomponenter] = useState<string[]>([]);

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

    const finnManglendeBrevValgfelt = (
        mal: MalStruktur,
        inkluderteDelmaler: Record<string, boolean>,
        valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>
    ): string[] => {
        return mal.delmaler
            .filter((delmal) => inkluderteDelmaler[delmal._id])
            .flatMap((delmal) => {
                const valgfeltForDelmal = Object.keys(valgfelt[delmal._id] ?? {});
                const påkrevdeFeltSomMangles: string[] = delmal.visningsdetaljer.pakrevdeValgfelt
                    .map((v) => v.valgfelt._ref)
                    .filter((påkrevdValgfelt) => !valgfeltForDelmal.includes(påkrevdValgfelt))
                    .map((påkrevdValgfelt) => {
                        const block = delmal.blocks.find(
                            (block) => block._type === 'valgfelt' && block._id === påkrevdValgfelt
                        ) as Valgfelt | undefined;
                        if (!block) {
                            return 'Finner ikke valgfelt blant blocks';
                        } else {
                            return block.visningsnavn;
                        }
                    });
                return påkrevdeFeltSomMangles;
            });
    };

    const oppdaterManglendeBrevKomponenterState = (
        mal: MalStruktur,
        inkluderteDelmaler: Record<string, boolean>,
        valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>,
        variabler: Partial<Record<string, string>>
    ) => {
        const manglendeBrevVariabler = finnManglendeBrevVariabler(
            mal,
            inkluderteDelmaler,
            valgfelt,
            variabler
        );
        const manglendeBrevValgfelt = finnManglendeBrevValgfelt(mal, inkluderteDelmaler, valgfelt);
        settManglendeBrevKomponenter([...manglendeBrevVariabler, ...manglendeBrevValgfelt]);
    };

    return {
        manglendeBrevKomponenter,
        settManglendeBrevKomponenter,
        oppdaterManglendeBrevKomponenterState,
    };
}

export default useManglendeBrevKomponenter;
