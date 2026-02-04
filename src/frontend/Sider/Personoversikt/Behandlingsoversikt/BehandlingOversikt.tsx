import React, { useEffect } from 'react';

import { Alert, Heading } from '@navikt/ds-react';

import { FagsakOversikt } from './FagsakOversikt';
import { useApp } from '../../../context/AppContext';
import { useHentBehandlingsoversikt } from '../../../hooks/useHentBehandlingsoversikt';
import { useHentKlagebehandlinger } from '../../../hooks/useKlagebehandlinger';
import DataViewer from '../../../komponenter/DataViewer';
import { erFeilressurs, pakkUtHvisSuksess } from '../../../typer/ressurs';
import {
    harNayTilleggsstønaderRolle,
    harTiltaksenhetenTilleggsstønaderRolle,
} from '../../../utils/roller';

const Behandlingsoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { saksbehandler, appEnv } = useApp();

    const { hentBehandlingsoversikt, behandlingsoversikt } = useHentBehandlingsoversikt();
    const { hentKlagebehandlinger, klagebehandlinger } = useHentKlagebehandlinger();
    useEffect(() => {
        hentBehandlingsoversikt(fagsakPersonId);
        hentKlagebehandlinger(fagsakPersonId);
    }, [fagsakPersonId, hentBehandlingsoversikt, hentKlagebehandlinger]);

    const rekjørHentKlagebehandlinger = () => hentKlagebehandlinger(fagsakPersonId);
    const rekjørHentBehandlinger = () => hentBehandlingsoversikt(fagsakPersonId);

    const utpakkedeKlagebehandlinger = pakkUtHvisSuksess(klagebehandlinger);

    const saksbehandlerTilhørerNay = harNayTilleggsstønaderRolle(appEnv, saksbehandler);
    const saksbehandlerTilhørerTiltaksenheten = harTiltaksenhetenTilleggsstønaderRolle(
        appEnv,
        saksbehandler
    );

    return (
        <>
            <Heading size="small">Behandlinger i TS-sak</Heading>
            <DataViewer type={'behandlingsoversikt'} response={{ behandlingsoversikt }}>
                {({ behandlingsoversikt }) => (
                    <>
                        {behandlingsoversikt.tilsynBarn && (
                            <FagsakOversikt
                                fagsakMedBehandlinger={behandlingsoversikt.tilsynBarn}
                                klagebehandlinger={utpakkedeKlagebehandlinger?.tilsynBarn ?? []}
                                hentBehandlinger={rekjørHentBehandlinger}
                                hentKlagebehandlinger={rekjørHentKlagebehandlinger}
                                kanOppretteBehandling={saksbehandlerTilhørerNay}
                            />
                        )}
                        {behandlingsoversikt.læremidler && (
                            <FagsakOversikt
                                fagsakMedBehandlinger={behandlingsoversikt.læremidler}
                                klagebehandlinger={utpakkedeKlagebehandlinger?.læremidler ?? []}
                                hentBehandlinger={rekjørHentBehandlinger}
                                hentKlagebehandlinger={rekjørHentKlagebehandlinger}
                                kanOppretteBehandling={saksbehandlerTilhørerNay}
                            />
                        )}
                        {behandlingsoversikt.boutgifter && (
                            <FagsakOversikt
                                fagsakMedBehandlinger={behandlingsoversikt.boutgifter}
                                klagebehandlinger={utpakkedeKlagebehandlinger?.boutgifter ?? []}
                                hentBehandlinger={rekjørHentBehandlinger}
                                hentKlagebehandlinger={rekjørHentKlagebehandlinger}
                                kanOppretteBehandling={saksbehandlerTilhørerNay}
                            />
                        )}
                        {behandlingsoversikt.dagligReiseTso && (
                            <FagsakOversikt
                                fagsakMedBehandlinger={behandlingsoversikt.dagligReiseTso}
                                klagebehandlinger={utpakkedeKlagebehandlinger?.dagligReiseTso ?? []}
                                hentBehandlinger={rekjørHentBehandlinger}
                                hentKlagebehandlinger={rekjørHentKlagebehandlinger}
                                kanOppretteBehandling={saksbehandlerTilhørerNay}
                            />
                        )}
                        {behandlingsoversikt.dagligReiseTsr && (
                            <FagsakOversikt
                                fagsakMedBehandlinger={behandlingsoversikt.dagligReiseTsr}
                                klagebehandlinger={utpakkedeKlagebehandlinger?.dagligReiseTsr ?? []}
                                hentBehandlinger={rekjørHentBehandlinger}
                                hentKlagebehandlinger={rekjørHentKlagebehandlinger}
                                kanOppretteBehandling={saksbehandlerTilhørerTiltaksenheten}
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
