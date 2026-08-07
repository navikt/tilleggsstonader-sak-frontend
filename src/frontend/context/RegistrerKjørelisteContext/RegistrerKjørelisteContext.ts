import constate from 'constate';

import {
    ManueltInnsendtKjørelisteUke,
    KjørelisteOversiktDto,
    ManuellKjørelisteRequest,
    ManuellRegistreringReise,
} from '../../Sider/Behandling/Kjøreliste/RegistrerKjørelisteManuelt/typer';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../typer/ressurs';
import { useApp } from '../AppContext';
import { useBehandling } from '../BehandlingContext';

interface Props {
    kjørelisteOversikt: KjørelisteOversiktDto;
    hentKjørelisteOversikt: () => void;
}

interface UseRegistrerKjøreliste {
    tilgjengeligeReiser: ManuellRegistreringReise[];
    kjørelisterLagretIBehandling: ManueltInnsendtKjørelisteUke[];
    lagreKjøreliste: (
        request: ManuellKjørelisteRequest
    ) => Promise<RessursSuksess<null> | RessursFeilet>;
    slettKjøreliste: (kjørelisteId: string) => Promise<RessursSuksess<null> | RessursFeilet>;
}

export const [RegistrerKjørelisteProvider, useRegistrerKjøreliste] = constate(
    ({ kjørelisteOversikt, hentKjørelisteOversikt }: Props): UseRegistrerKjøreliste => {
        const { request } = useApp();
        const { behandling } = useBehandling();

        const lagreKjøreliste = async (
            kjørelisteRequest: ManuellKjørelisteRequest
        ): Promise<RessursSuksess<null> | RessursFeilet> => {
            const respons = await request<null, ManuellKjørelisteRequest>(
                `/api/sak/kjoreliste/manuell-registrering/${behandling.id}`,
                'POST',
                kjørelisteRequest
            );

            if (respons.status === RessursStatus.SUKSESS) {
                hentKjørelisteOversikt();
            }

            return respons;
        };

        const slettKjøreliste = async (
            kjørelisteId: string
        ): Promise<RessursSuksess<null> | RessursFeilet> => {
            const respons = await request<null, null>(
                `/api/sak/kjoreliste/manuell-registrering/${behandling.id}/${kjørelisteId}`,
                'DELETE'
            );

            if (respons.status === RessursStatus.SUKSESS) {
                hentKjørelisteOversikt();
            }

            return respons;
        };

        return {
            tilgjengeligeReiser: kjørelisteOversikt.tilgjengeligeReiser,
            kjørelisterLagretIBehandling: kjørelisteOversikt.kjørelisterLagretIBehandling,
            lagreKjøreliste,
            slettKjøreliste,
        };
    }
);
