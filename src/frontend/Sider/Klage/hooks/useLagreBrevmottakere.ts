import { IBrevmottakere } from '../Steg/Brev/Brevmottakere/typer';
import { useApp } from '../../../context/AppContext';

export const useLagreBrevmottakere = (behandlingId: string) => {
    const { request } = useApp();

    const lagreBrevmottakere = (brevmottakere: IBrevmottakere) =>
        request<IBrevmottakere, IBrevmottakere>(
            `/api/klage/brev/${behandlingId}/mottakere`,
            'POST',
            brevmottakere
        );

    return { lagreBrevmottakere };
};
