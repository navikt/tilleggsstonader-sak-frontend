import { useEffect } from 'react';

import { useKlageApp } from '../context/KlageAppContext';

export const useSetPersonIdent = (personIdent: string) => {
    const { settPersonIdent } = useKlageApp();

    useEffect(() => {
        settPersonIdent(personIdent);
        return () => settPersonIdent(undefined);
    }, [settPersonIdent, personIdent]);

    return {};
};
