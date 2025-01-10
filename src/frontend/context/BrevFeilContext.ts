import { useEffect, useMemo, useState } from 'react';

import constate from 'constate';

import { defaultMangelIBrev, MangelIBrev } from '../komponenter/Brev/mangelIBrev';

export const [BrevFeilProvider, useBrevFeil] = constate(() => {
    const [mangelIBrev, settMangelIBrev] = useState<MangelIBrev>(defaultMangelIBrev);
    const [visMangelIBrev, settVisMangelIBrev] = useState(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    const idSomMangler = useMemo(() => {
        return new Set([
            ...mangelIBrev.variabler.map((v) => v._id),
            ...mangelIBrev.delmaler,
            ...mangelIBrev.valgfelt.map((v) => v._id),
        ]);
    }, [mangelIBrev]);

    useEffect(() => {
        if (idSomMangler.size === 0) {
            settFeilmelding(undefined);
        }
    }, [idSomMangler]);

    return {
        mangelIBrev,
        settMangelIBrev,
        settVisMangelIBrev,
        settFeilmelding,
        feilmelding,
        harFeilForBrevKomponent: (id: string) => visMangelIBrev && idSomMangler.has(id),
    };
});
