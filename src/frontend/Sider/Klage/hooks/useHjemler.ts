import { useEffect, useState } from 'react';

import { useApp } from '../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { Hjemmel } from '../Steg/Vurdering/hjemmel';

export const useHjemler = (behandlingId: string) => {
    const { request } = useApp();

    const [hjemler, settHjemler] = useState<Ressurs<Hjemmel[]>>(byggTomRessurs);

    useEffect(() => {
        request<Hjemmel[], null>(`/api/klage/hjemmel/tilgjenglige-hjemler/${behandlingId}`).then(
            settHjemler
        );
    }, [request, behandlingId]);

    return {
        hjemler,
    };
};
