import { useCallback, useState } from 'react';

import { useApp } from '../context/KlageAppContext';
import { IVurdering } from '../../Komponenter/Behandling/Vurdering/vurderingValg';
import {
    RessursSuksess,
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
} from '../../../../typer/ressurs';

interface IMelding {
    tekst: string;
    type: 'success' | 'error';
}

export const useHentVurderinger = (): {
    vurdering: Ressurs<IVurdering>;
    hentVurdering: (behandlingId: string) => void;
    lagreVurdering: (
        vurderinger: IVurdering
    ) => Promise<RessursSuksess<IVurdering> | RessursFeilet>;
    feilVedLagring: string;
    melding: IMelding | undefined;
    settMelding: (melding?: IMelding) => void;
} => {
    const { axiosRequest } = useApp();

    const [feilVedLagring, settFeilVedLagring] = useState<string>('');
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
        settFeilVedLagring('');
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
        feilVedLagring,
        melding,
        settMelding,
    };
};
