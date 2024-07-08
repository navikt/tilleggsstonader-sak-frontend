import { useKlageApp } from '../context/KlageAppContext';
import { useEffect } from 'react';

export const useSetPersonIdent = (personIdent: string) => {
    const { settPersonIdent } = useKlageApp();

    useEffect(() => {
        settPersonIdent(personIdent);
        return () => settPersonIdent(undefined);
    }, [settPersonIdent, personIdent]);

    return {};
};
