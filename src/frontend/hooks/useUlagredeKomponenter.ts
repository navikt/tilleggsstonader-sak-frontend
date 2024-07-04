import { useState } from 'react';

/**
 * State for å kunne sette et eller flere komponenter til ulagret.
 * Eks at man setter en periode for målgruppe til redigering, eller endrer en beskrivelse eller beløp
 */
export const useUlagredeKomponenter = () => {
    const [ulagradeKomponenter, settUlagradeKomponenter] = useState<Set<string>>(new Set());

    const settUlagretKomponent = (komponentId: string) => {
        settUlagradeKomponenter((prevState) => new Set(prevState).add(komponentId));
    };

    const nullstillUlagretKomponent = (komponentId: string) => {
        settUlagradeKomponenter((prevState) => {
            const kopi = new Set(prevState);
            kopi.delete(komponentId);
            return kopi;
        });
    };

    const nullstillUlagredeKomponenter = () => {
        if (ulagradeKomponenter.size > 0) {
            settUlagradeKomponenter(new Set());
        }
    };

    return {
        ulagradeKomponenter,
        harUlagradeKomponenter: ulagradeKomponenter.size > 0,
        settUlagretKomponent,
        nullstillUlagretKomponent,
        nullstillUlagredeKomponenter,
    };
};

export enum UlagretKomponent {
    AKTIVITET = 'aktivitet',
    MÅLGRUPPE = 'målgruppe',
    STØNADSPERIODER = 'stønadsperioder',
    BEREGNING_AVSLÅ = 'beregning - avslå',
    BEREGNING_INNVILGE = 'beregning - innvilge',
    FATTE_VEDTAK = 'fatte vedtak',
}
