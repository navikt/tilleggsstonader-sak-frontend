import { useApp } from '../context/KlageAppContext';
import { useEffect } from 'react';

export const useSetValgtFagsakId = (fagsakId: string) => {
    const { settValgtFagsakId } = useApp();

    useEffect(() => {
        settValgtFagsakId(fagsakId);
        return () => settValgtFagsakId(undefined);
    }, [settValgtFagsakId, fagsakId]);

    return {};
};
