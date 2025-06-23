import React, { useEffect, useState } from 'react';

import { Alert, BodyShort } from '@navikt/ds-react';

import { useBehandling } from '../../context/BehandlingContext';
import { SaksbehandlerDto, SaksbehandlerRolle } from '../../typer/behandling/saksbehandlerDto';

const TilordnetSaksbehandler: React.FC = () => {
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;
    const { behandling, hentBehandling } = useBehandling();

    useEffect(() => {
        if (
            behandling.tilordnetSaksbehandler?.rolle === SaksbehandlerRolle.OPPGAVE_FINNES_IKKE &&
            retryCount < maxRetries
        ) {
            const timeout = setTimeout(() => {
                hentBehandling.rerun();
                setRetryCount((prev) => prev + 1);
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [behandling.tilordnetSaksbehandler, hentBehandling, retryCount]);

    const saksbehandler = behandling.tilordnetSaksbehandler;

    const visingsnavn = utledVisningsnavn(saksbehandler);

    const skalViseAnsvarligSaksbehandler =
        saksbehandler?.rolle !== SaksbehandlerRolle.OPPGAVE_FINNES_IKKE;

    return (
        <div>
            {skalViseAnsvarligSaksbehandler && (
                <div>
                    <BodyShort weight={'semibold'} size={'small'}>
                        Ansvarlig saksbehandler:
                    </BodyShort>
                    <BodyShort size={'small'}>{visingsnavn}</BodyShort>
                </div>
            )}
            <div style={{ marginLeft: '-1rem', marginTop: '0.5rem' }}>
                {saksbehandler?.rolle ===
                    SaksbehandlerRolle.OPPGAVE_TILHØRER_IKKE_TILLEGGSSTONADER && (
                    <Alert variant={'warning'} style={{ padding: '1rem' }}>
                        Behandlingens tilhørende oppgave er enten feilregistrert eller satt på et
                        annet tema.
                    </Alert>
                )}
            </div>
        </div>
    );
};

export function utledVisningsnavn(ansvarligSaksbehandler: SaksbehandlerDto | undefined) {
    switch (ansvarligSaksbehandler?.rolle) {
        case SaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER:
        case SaksbehandlerRolle.OPPGAVE_FINNES_IKKE_SANNSYNLIGVIS_INNLOGGET_SAKSBEHANDLER:
        case SaksbehandlerRolle.ANNEN_SAKSBEHANDLER:
            return `${ansvarligSaksbehandler.fornavn} ${ansvarligSaksbehandler.etternavn}`;
        default:
            return 'ingen ansvarlig';
    }
}

export default TilordnetSaksbehandler;
