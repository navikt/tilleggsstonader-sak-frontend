import { useMemo } from 'react';

/**
 * Mapper om en liste til Map for å enkelt kunne hente ut et objekt ut fra id
 */
export const useMapById = <T extends { id: string }>(list: T[]): Map<string, T> =>
    useMemo(() => {
        const map = new Map<string, T>();
        list.forEach((item) => map.set(item.id, item));
        return map;
    }, [list]);
