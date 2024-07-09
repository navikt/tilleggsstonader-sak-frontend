import { HenlagtÅrsak } from '../../../typer/behandling/behandlingÅrsak';
import { useApp } from '../../../context/AppContext';

export const useHenleggBehandling = (behandlingId: string) => {
    const { request } = useApp();

    type HenlagtÅrsakDto = {
        årsak: HenlagtÅrsak;
    };

    const lagreHenleggelse = (henlagtårsak: HenlagtÅrsak) =>
        request<string, HenlagtÅrsakDto>(`/api/klage/behandling/${behandlingId}/henlegg`, 'POST', {
            årsak: henlagtårsak,
        });

    return { lagreHenleggelse };
};
