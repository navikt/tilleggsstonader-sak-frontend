import { useApp } from '../context/AppContext';
import { useBehandling } from '../context/BehandlingContext';
import { stønadstypeTilVedtakUrl } from '../Sider/Behandling/VedtakOgBeregning/Felles/stønadstypeTilVedtakUrl';
import { TypeVedtak, ÅrsakOpphør } from '../typer/vedtak/vedtak';

export type OpphørRequest = {
    type: TypeVedtak.OPPHØR;
    årsakerOpphør: ÅrsakOpphør[];
    begrunnelse: string;
    opphørsdato: string | undefined;
};

export const useLagreOpphør = () => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { id, stønadstype } = behandling;

    const lagreOpphør = (
        årsakerOpphør: ÅrsakOpphør[],
        begrunnelse: string,
        opphørsdato: string | undefined
    ) =>
        request<null, OpphørRequest>(
            `/api/sak/vedtak/${stønadstypeTilVedtakUrl[stønadstype]}/${id}/opphor`,
            'POST',
            {
                type: TypeVedtak.OPPHØR,
                årsakerOpphør: årsakerOpphør,
                begrunnelse: begrunnelse,
                opphørsdato: opphørsdato,
            }
        );

    return { lagreOpphør };
};
