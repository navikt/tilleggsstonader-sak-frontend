import { useState } from 'react';
import { IFormkravVilkår } from '../../Komponenter/Behandling/Formkrav/typer';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { formkravVilkårDummyData } from '../api/klage-stubs';

export const useHentFormkravVilkår = (): {
    vilkårsvurderinger: Ressurs<IFormkravVilkår>;
    hentVilkårsvurderinger: (behandlingId: string) => void;
    lagreVilkårsvurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    feilVedLagring: string;
} => {
    const { axiosRequest } = useApp();

    const [feilVedLagring, settFeilVedLagring] = useState<string>('');

    const [vilkårsvurderinger, settVilkårsvurderinger] =
        useState<Ressurs<IFormkravVilkår>>(byggTomRessurs);

    // const hentVilkårsvurderinger = useCallback(
    //     (behandlingId: string) => {
    //         axiosRequest<IFormkravVilkår, null>({
    //             method: 'GET',
    //             url: `/familie-klage/api/formkrav/vilkar/${behandlingId}`,
    //         }).then((hentedeVurderinger: RessursSuksess<IFormkravVilkår> | RessursFeilet) => {
    //             settVilkårsvurderinger(hentedeVurderinger);
    //         });
    //     },
    //     [axiosRequest]
    // );
    //
    // const lagreVilkårsvurderinger = (
    //     vurderinger: IFormkravVilkår
    // ): Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet> => {
    //     settFeilVedLagring('');
    //     return axiosRequest<IFormkravVilkår, IFormkravVilkår>({
    //         method: 'POST',
    //         url: `/familie-klage/api/formkrav`,
    //         data: vurderinger,
    //     }).then((respons: RessursSuksess<IFormkravVilkår> | RessursFeilet) => {
    //         if (respons.status === RessursStatus.SUKSESS) {
    //             settVilkårsvurderinger(respons);
    //         } else {
    //             settFeilVedLagring(respons.frontendFeilmelding ?? 'Noe gikk galt ved innsending');
    //         }
    //         return respons;
    //     });
    // };


    // TODO: Bytt ut disse dummy-funksjonene når vi får backend opp å kjøre
    const hentVilkårsvurderinger = () => {
        settVilkårsvurderinger({ status: RessursStatus.SUKSESS, data: formkravVilkårDummyData });
    };

    const lagreVilkårsvurderinger = (
        vurderinger: IFormkravVilkår
    ): Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet> => {
        settFeilVedLagring('');
        settVilkårsvurderinger({ status: RessursStatus.SUKSESS, data: formkravVilkårDummyData });
        return Promise.resolve({ status: RessursStatus.SUKSESS, data: formkravVilkårDummyData });
    };

    return {
        vilkårsvurderinger,
        hentVilkårsvurderinger,
        lagreVilkårsvurderinger,
        feilVedLagring,
    };
};
