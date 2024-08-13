import { byggBrevmottakerUrlForGittKontekst } from './useBrevmottakere';
import { useApp } from '../context/AppContext';
import { Applikasjonskontekst, IBrevmottakere } from '../komponenter/Brevmottakere/typer';

export const useLagreBrevmottakere = (
    behandlingId: string,
    applikasjonskontekst: Applikasjonskontekst
) => {
    const { request } = useApp();

    const lagreBrevmottakere = (brevmottakere: IBrevmottakere) =>
        request<IBrevmottakere, IBrevmottakere>(
            byggBrevmottakerUrlForGittKontekst(behandlingId, applikasjonskontekst),
            'POST',
            brevmottakere
        );

    return { lagreBrevmottakere };
};
