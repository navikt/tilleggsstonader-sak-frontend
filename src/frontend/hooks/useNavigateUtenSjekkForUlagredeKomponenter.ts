import { useEffect, useState } from 'react';

import { type NavigateOptions, useNavigate } from 'react-router-dom';

import { useApp } from '../context/AppContext';

interface Navigasjon {
    path: string;
    options?: NavigateOptions;
}

/**
 * Kan ikke kjøre navigate direkte fordi navigate er i blocked state,
 * selv om nullstill ligger før denne metoden
 */
export const useNavigateUtenSjekkForUlagredeKomponenter = () => {
    const { nullstillUlagredeKomponenter } = useApp();
    const navigate = useNavigate();

    const [navigasjon, settNavigasjon] = useState<Navigasjon>();

    useEffect(() => {
        if (navigasjon) {
            navigate(navigasjon.path, navigasjon.options);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigasjon]);

    return (path: string, options?: NavigateOptions) => {
        nullstillUlagredeKomponenter();
        settNavigasjon({ path, options });
    };
};
