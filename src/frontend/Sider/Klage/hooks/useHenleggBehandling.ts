import { useApp } from '../../../context/AppContext';
import { HenlagtÅrsak } from '../../../typer/behandling/behandlingÅrsak';

export const useHenleggBehandling = (behandlingId: string) => {
    const { request } = useApp();

    type HenlagtÅrsakDto = {
        årsak: HenlagtÅrsak;
        begrunnelse?: string;
    };

    const lagreHenleggelse = (henlagtårsak: HenlagtÅrsak, henlagtBegrunnelse?: string) =>
        request<string, HenlagtÅrsakDto>(`/api/klage/behandling/${behandlingId}/henlegg`, 'POST', {
            årsak: henlagtårsak,
            begrunnelse: henlagtBegrunnelse,
        });

    return { lagreHenleggelse };
};
