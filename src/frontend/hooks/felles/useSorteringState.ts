import { useMemo, useState } from 'react';

import { compareAsc, compareDesc } from 'date-fns';

import { erGyldigDato } from '../../utils/dato';

interface SortState {
    orderBy: string;
    direction: 'ascending' | 'descending';
}

/**
 * Extender SortState som finnes i ds-react, for å kunne sette at orderBy er en keyof T
 */
export interface SorteringConfig<T> extends SortState {
    orderBy: keyof T & string;
}

interface ISortering<T> {
    sortertListe: T[];
    settSortering: (sorteringfelt: keyof T & string) => void;
    sortState: SorteringConfig<T> | undefined;
}

const erDatoFelt = <T>(maybeDateA: T[keyof T], maybeDateB: T[keyof T]): boolean => {
    if (typeof maybeDateA === 'string' && typeof maybeDateB === 'string') {
        return erGyldigDato(maybeDateA) && erGyldigDato(maybeDateB);
    }
    return false;
};

export const useSorteringState = <T>(liste: T[], config?: SorteringConfig<T>): ISortering<T> => {
    const [sortState, setSortState] = useState<SorteringConfig<T> | undefined>(config);

    const sortertListe = useMemo(() => {
        const listeKopi = [...liste];
        if (sortState) {
            listeKopi.sort((a, b) => {
                if (!a[sortState?.orderBy]) {
                    return sortState?.direction === 'ascending' ? -1 : 1;
                }
                if (!b[sortState?.orderBy]) {
                    return sortState?.direction === 'ascending' ? 1 : -1;
                }
                if (erDatoFelt(a[sortState?.orderBy], b[sortState?.orderBy])) {
                    const dateStringA = a[sortState?.orderBy] as unknown as string;
                    const dateStringB = b[sortState?.orderBy] as unknown as string;
                    return sortState?.direction === 'ascending'
                        ? compareAsc(new Date(dateStringA), new Date(dateStringB))
                        : compareDesc(new Date(dateStringA), new Date(dateStringB));
                }
                if (a[sortState?.orderBy] < b[sortState?.orderBy]) {
                    return sortState?.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortState?.orderBy] > b[sortState?.orderBy]) {
                    return sortState?.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return listeKopi;
    }, [liste, sortState]);

    const settSortering = (sorteringsfelt: keyof T & string) => {
        if (
            sortState &&
            sorteringsfelt === sortState.orderBy &&
            sortState.direction === 'descending'
        ) {
            setSortState(undefined);
        } else {
            setSortState({
                orderBy: sorteringsfelt,
                direction:
                    sortState &&
                    sorteringsfelt === sortState.orderBy &&
                    sortState.direction === 'ascending'
                        ? 'descending'
                        : 'ascending',
            });
        }
    };

    return {
        sortertListe,
        settSortering,
        sortState,
    };
};
