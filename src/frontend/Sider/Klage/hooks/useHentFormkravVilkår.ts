import { useCallback, useState } from 'react';

import { useApp } from '../../../context/AppContext';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../typer/ressurs';
import { IFormkravVilkår } from '../Steg/Formkrav/typer';

export const useHentFormkravVilkår = (): {
    vilkårsvurderinger: Ressurs<IFormkravVilkår>;
    hentVilkårsvurderinger: (behandlingId: string) => void;
    lagreVilkårsvurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    feilVedLagring: string;
} => {
    const { request } = useApp();

    const [feilVedLagring, settFeilVedLagring] = useState<string>('');

    const [vilkårsvurderinger, settVilkårsvurderinger] =
        useState<Ressurs<IFormkravVilkår>>(byggTomRessurs);

    const hentVilkårsvurderinger = useCallback(
        (behandlingId: string) => {
            request<IFormkravVilkår, null>(`/api/klage/formkrav/vilkar/${behandlingId}`).then(
                settVilkårsvurderinger
            );
        },
        [request]
    );

    const lagreVilkårsvurderinger = (
        vurderinger: IFormkravVilkår
    ): Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet> => {
        settFeilVedLagring('');
        return request<IFormkravVilkår, IFormkravVilkår>(
            `/api/klage/formkrav`,
            'POST',
            vurderinger
        ).then((respons: RessursSuksess<IFormkravVilkår> | RessursFeilet) => {
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
