import { useState } from 'react';

/**
 * State for å kunne sette et eller flere felt til ulagret
 */
export const useUlagretData = () => {
    const [ikkePersisterteKomponenter, settIkkePersisterteKomponenter] = useState<Set<string>>(
        new Set()
    );

    const settIkkePersistertKomponent = (komponentId: string) => {
        settIkkePersisterteKomponenter((prevState) => new Set(prevState).add(komponentId));
    };

    const nullstillIkkePersistertKomponent = (komponentId: string) => {
        settIkkePersisterteKomponenter((prevState) => {
            const kopi = new Set(prevState);
            kopi.delete(komponentId);
            return kopi;
        });
    };

    const nullstillIkkePersisterteKomponenter = () => {
        if (ikkePersisterteKomponenter.size > 0) {
            settIkkePersisterteKomponenter(new Set());
        }
    };

    return {
        harUlagretData: ikkePersisterteKomponenter.size > 0,
        settIkkePersistertKomponent,
        nullstillIkkePersistertKomponent,
        nullstillIkkePersisterteKomponenter,
    };
};
