import React, { useEffect } from 'react';

import { Alert, Heading } from '@navikt/ds-react';

import { FagsakOversikt } from './FagsakOversikt';
import { useHentBehandlingsoversikt } from '../../../hooks/useHentBehandlingsoversikt';
import { useHentKlagebehandlinger } from '../../../hooks/useKlagebehandlinger';
import DataViewer from '../../../komponenter/DataViewer';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { erFeilressurs, pakkUtHvisSuksess } from '../../../typer/ressurs';
import {
    mapFagsakPersonTilTabellrader,
    mapKlagesakerTilTabellrader,
    sorterBehandlinger,
} from '../../../utils/behandlingutil';

const Behandlingsoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { hentBehandlingsoversikt, behandlingsoversikt } = useHentBehandlingsoversikt();
    const { hentKlagebehandlinger, klagebehandlinger } = useHentKlagebehandlinger();

    useEffect(() => {
        hentBehandlingsoversikt(fagsakPersonId);
        hentKlagebehandlinger(fagsakPersonId);
    }, [fagsakPersonId, hentBehandlingsoversikt, hentKlagebehandlinger]);

    const rekjørHentKlagebehandlinger = () => hentKlagebehandlinger(fagsakPersonId);
    const rekjørHentBehandlinger = () => hentBehandlingsoversikt(fagsakPersonId);

    const tabellBehandlinger = [
        ...mapFagsakPersonTilTabellrader(
            pakkUtHvisSuksess(behandlingsoversikt)?.tilsynBarn?.behandlinger
        ),
        ...mapKlagesakerTilTabellrader(pakkUtHvisSuksess(klagebehandlinger)?.tilsynBarn),
    ].sort(sorterBehandlinger);

    return (
        <>
            <Heading size="small">Behandlinger i TS-sak</Heading>
            <DataViewer response={{ behandlingsoversikt }}>
                {({ behandlingsoversikt }) => (
                    <>
                        {behandlingsoversikt.tilsynBarn && (
                            <FagsakOversikt
                                fagsakId={behandlingsoversikt.tilsynBarn.fagsakId}
                                stønadstype={Stønadstype.BARNETILSYN}
                                fagsakEskternID={behandlingsoversikt.tilsynBarn.eksternFagsakId}
                                fagsakErLøpende={behandlingsoversikt.tilsynBarn.erLøpende}
                                tabellbehandlinger={tabellBehandlinger}
                                hentBehandlinger={rekjørHentBehandlinger}
                                hentKlagebehandlinger={rekjørHentKlagebehandlinger}
                            />
                        )}
                    </>
                )}
            </DataViewer>
            {erFeilressurs(klagebehandlinger) && (
                <Alert variant="error">
                    Kunne ikke hente klagesaker. {klagebehandlinger.frontendFeilmelding}
                </Alert>
            )}
        </>
    );
};
export default Behandlingsoversikt;
