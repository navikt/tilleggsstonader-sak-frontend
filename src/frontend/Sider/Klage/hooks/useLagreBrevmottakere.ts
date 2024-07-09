import { IBrevmottakere } from '../Steg/Brev/Brevmottakere/typer';
import { useKlageApp } from '../context/KlageAppContext';

export const useLagreBrevmottakere = (behandlingId: string) => {
    const { axiosRequest } = useKlageApp();

    const lagreBrevmottakere = (brevmottakere: IBrevmottakere) =>
        axiosRequest<IBrevmottakere, IBrevmottakere>({
            url: `api/klage/brev/${behandlingId}/mottakere`,
            method: 'POST',
            data: brevmottakere,
        });

    return { lagreBrevmottakere };
};
