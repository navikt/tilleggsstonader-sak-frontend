import { useApp } from '../context/AppContext';
import { useBehandling } from '../context/BehandlingContext';
import { stønadstypeTilVedtakUrl } from '../Sider/Behandling/VedtakOgBeregning/Felles/stønadstypeTilVedtakUrl';
import { TypeVedtak, ÅrsakAvslag } from '../typer/vedtak/vedtak';

export type AvslagRequest = {
    type: TypeVedtak.AVSLAG;
    årsakerAvslag: ÅrsakAvslag[];
    begrunnelse: string;
};

export const useLagreAvslag = () => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { id, stønadstype } = behandling;

    const lagreAvslag = (årsakerAvslag: ÅrsakAvslag[], begrunnelse: string) =>
        request<null, AvslagRequest>(
            `/api/sak/vedtak/${stønadstypeTilVedtakUrl[stønadstype]}/${id}/avslag`,
            'POST',
            { type: TypeVedtak.AVSLAG, årsakerAvslag, begrunnelse }
        );

    return { lagreAvslag };
};
