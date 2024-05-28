import { useState } from 'react';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { IVurdering } from '../../Komponenter/Behandling/Vurdering/vurderingValg';
import { vurderingStub } from '../api/klage-stubs';

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
    //
    // const hentVurdering = useCallback(
    //     (behandlingId: string) => {
    //         axiosRequest<IVurdering, null>({
    //             method: 'GET',
    //             url: `/familie-klage/api/vurdering/${behandlingId}`,
    //         }).then((hentetVurdering: RessursSuksess<IVurdering> | RessursFeilet) => {
    //             settVurdering(hentetVurdering);
    //         });
    //     },
    //     [axiosRequest]
    // );
    //
    // const lagreVurdering = (
    //     vurdering: IVurdering
    // ): Promise<RessursSuksess<IVurdering> | RessursFeilet> => {
    //     settFeilVedLagring('');
    //     return axiosRequest<IVurdering, IVurdering>({
    //         method: 'POST',
    //         url: `/familie-klage/api/vurdering`,
    //         data: vurdering,
    //     }).then((respons: RessursSuksess<IVurdering> | RessursFeilet) => {
    //         if (respons.status === RessursStatus.SUKSESS) {
    //             settVurdering(respons);
    //             settMelding({
    //                 tekst: 'Vurderingen er lagret',
    //                 type: 'success',
    //             });
    //         } else {
    //             settMelding({
    //                 tekst: respons.frontendFeilmelding || 'Noe gikk galt ved innsending',
    //                 type: 'error',
    //             });
    //         }
    //         return respons;
    //     });
    // };

    // TODO: Bytt ut disse to dummy-funksjonene når backend er på plass
    const hentVurdering = () => {
        settVurdering({ status: RessursStatus.SUKSESS, data: vurderingStub });
    };

    const lagreVurdering = (
        vurdering: IVurdering
    ): Promise<RessursSuksess<IVurdering> | RessursFeilet> => {
        settFeilVedLagring('');

        settVurdering({ status: RessursStatus.SUKSESS, data: vurderingStub });

        settMelding({
            tekst: 'Vurderingen er lagret',
            type: 'success',
        });

        return Promise.resolve({ status: RessursStatus.SUKSESS, data: vurderingStub });
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
