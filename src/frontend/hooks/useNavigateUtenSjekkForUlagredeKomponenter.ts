import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useApp } from '../context/AppContext';

/**
 * Kan ikke kjøre navigate direkte fordi navigate er i blocked state,
 * selv om nullstill ligger før denne metoden
 */
export const useNavigateUtenSjekkForUlagredeKomponenter = () => {
    const { nullstillUlagredeKomponenter } = useApp();
    const navigate = useNavigate();

    const [path, settPath] = useState<string>();

    useEffect(() => {
        if (path) {
            navigate(path);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path]);

    return (path: string) => {
        nullstillUlagredeKomponenter();
        settPath(path);
    };
};
