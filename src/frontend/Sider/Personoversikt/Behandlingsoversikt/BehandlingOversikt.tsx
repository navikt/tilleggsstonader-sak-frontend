import React, { useEffect } from 'react';

import { Alert, Heading } from '@navikt/ds-react';

import { VedtaksoversiktArena } from './Arena/VedtaksoversiktArena';
import { FagsakOversikt } from './FagsakOversikt';
import { useHentBehandlingsoversikt } from '../../../hooks/useHentBehandlingsoversikt';
import { useHentKlagebehandlinger } from '../../../hooks/useKlagebehandlinger';
import DataViewer from '../../../komponenter/DataViewer';
import { erFeilressurs, pakkUtHvisSuksess } from '../../../typer/ressurs';

const Behandlingsoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { hentBehandlingsoversikt, behandlingsoversikt } = useHentBehandlingsoversikt();
    const { hentKlagebehandlinger, klagebehandlinger } = useHentKlagebehandlinger();

    useEffect(() => {
        hentBehandlingsoversikt(fagsakPersonId);
        hentKlagebehandlinger(fagsakPersonId);
    }, [fagsakPersonId, hentBehandlingsoversikt, hentKlagebehandlinger]);

    const rekjørHentKlagebehandlinger = () => hentKlagebehandlinger(fagsakPersonId);
    const rekjørHentBehandlinger = () => hentBehandlingsoversikt(fagsakPersonId);

    const utpakkedeKlagebehandlinger = pakkUtHvisSuksess(klagebehandlinger);

    return (
        <>
            <Heading size="small">Behandlinger i TS-sak</Heading>
            <DataViewer response={{ behandlingsoversikt }}>
                {({ behandlingsoversikt }) => (
                    <>
                        {behandlingsoversikt.tilsynBarn && (
                            <FagsakOversikt
                                fagsakMedBehandlinger={behandlingsoversikt.tilsynBarn}
                                klagebehandlinger={utpakkedeKlagebehandlinger?.tilsynBarn ?? []}
                                hentBehandlinger={rekjørHentBehandlinger}
                                hentKlagebehandlinger={rekjørHentKlagebehandlinger}
                            />
                        )}
                        {behandlingsoversikt.læremidler && (
                            <FagsakOversikt
                                fagsakMedBehandlinger={behandlingsoversikt.læremidler}
                                klagebehandlinger={utpakkedeKlagebehandlinger?.læremidler ?? []}
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
            <VedtaksoversiktArena fagsakPersonId={fagsakPersonId} />
        </>
    );
};
export default Behandlingsoversikt;
