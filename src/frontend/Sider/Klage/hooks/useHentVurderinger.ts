import { useCallback, useState } from 'react';

import { useKlageApp } from '../context/KlageAppContext';
import { IVurdering } from '../Steg/Vurdering/vurderingValg';
import {
    RessursSuksess,
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
} from '../../../typer/ressurs';

interface IMelding {
    tekst: string;
    type: 'success' | 'error';
}

export const useHentVurderinger = () => {
    const { axiosRequest } = useKlageApp();

    const [melding, settMelding] = useState<IMelding>();

    const [vurdering, settVurdering] = useState<Ressurs<IVurdering>>(byggTomRessurs);

    const hentVurdering = useCallback(
        (behandlingId: string) => {
            axiosRequest<IVurdering, null>({
                method: 'GET',
                url: `/api/klage/vurdering/${behandlingId}`,
            }).then((hentetVurdering: RessursSuksess<IVurdering> | RessursFeilet) => {
                settVurdering(hentetVurdering);
            });
        },
        [axiosRequest]
    );

    const lagreVurdering = (
        vurdering: IVurdering
    ): Promise<RessursSuksess<IVurdering> | RessursFeilet> => {
        return axiosRequest<IVurdering, IVurdering>({
            method: 'POST',
            url: `/api/klage/vurdering`,
            data: vurdering,
        }).then((respons: RessursSuksess<IVurdering> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                settVurdering(respons);
                settMelding({
                    tekst: 'Vurderingen er lagret',
                    type: 'success',
                });
            } else {
                settMelding({
                    tekst: respons.frontendFeilmelding || 'Noe gikk galt ved innsending',
                    type: 'error',
                });
            }
            return respons;
        });
    };

    return {
        vurdering,
        hentVurdering,
        lagreVurdering,
        melding,
        settMelding,
    };
};
