import { useCallback } from 'react';

import { useBeforeUnload } from 'react-router-dom';

/**
 * Viser en alert hvis man forlater eller unloader komponenten når det finnes ulagret endring
 * I de tilfeller man ikke ønsker å bruke [UlagretDataModal] som vises hvis det finnes en ulagret komponent
 */
export const useVisFeilmeldingVedUnload = (ulagretEndring: boolean) => {
    useBeforeUnload(
        useCallback(
            (event) => {
                if (ulagretEndring) {
                    event.preventDefault();
                }
            },
            [ulagretEndring]
        ),
        { capture: true }
    );
};
