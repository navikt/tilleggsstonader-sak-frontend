import { useCallback, useState } from 'react';
import { IFormkravVilkår } from '../Steg/Formkrav/typer';
import { useKlageApp } from '../context/KlageAppContext';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';

export const useHentFormkravVilkår = (): {
    vilkårsvurderinger: Ressurs<IFormkravVilkår>;
    hentVilkårsvurderinger: (behandlingId: string) => void;
    lagreVilkårsvurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    feilVedLagring: string;
} => {
    const { axiosRequest } = useKlageApp();
    const { request } = useApp();

    const [feilVedLagring, settFeilVedLagring] = useState<string>('');

    const [vilkårsvurderinger, settVilkårsvurderinger] =
        useState<Ressurs<IFormkravVilkår>>(byggTomRessurs);

    const hentVilkårsvurderinger = (behandlingId: string) => {
        request<IFormkravVilkår, null>(`/api/klage/formkrav/vilkar/${behandlingId}`).then(
            settVilkårsvurderinger
        );
    };

    const lagreVilkårsvurderinger = (
        vurderinger: IFormkravVilkår
    ): Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet> => {
        settFeilVedLagring('');
        return axiosRequest<IFormkravVilkår, IFormkravVilkår>({
            method: 'POST',
            url: `/api/klage/formkrav`,
            data: vurderinger,
        }).then((respons: RessursSuksess<IFormkravVilkår> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                settVilkårsvurderinger(respons);
            } else {
                settFeilVedLagring(respons.frontendFeilmelding ?? 'Noe gikk galt ved innsending');
            }
            return respons;
        });
    };

    return {
        vilkårsvurderinger,
        hentVilkårsvurderinger,
        lagreVilkårsvurderinger,
        feilVedLagring,
    };
};
