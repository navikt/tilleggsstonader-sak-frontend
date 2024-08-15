import { useEffect } from 'react';

import { useKlageApp } from '../context/KlageAppContext';

export const useSetValgtFagsakId = (fagsakId: string) => {
    const { settValgtFagsakId } = useKlageApp();

    useEffect(() => {
        settValgtFagsakId(fagsakId);
        return () => settValgtFagsakId(undefined);
    }, [settValgtFagsakId, fagsakId]);

    return {};
};
