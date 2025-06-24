import React from 'react';

import { Alert, BodyShort } from '@navikt/ds-react';

import { UsehentTilordnetSaksbehandler } from '../../hooks/usehentTilordnetSaksbehandler';
import { SaksbehandlerDto, SaksbehandlerRolle } from '../../typer/behandling/saksbehandlerDto';
import DataViewer from '../DataViewer';

const TilordnetSaksbehandler: React.FC = () => {
    const { tilordnetSaksbehandler } = UsehentTilordnetSaksbehandler();

    return (
        <DataViewer response={{ tilordnetSaksbehandler }}>
            {({ tilordnetSaksbehandler }) => (
                <div>
                    {tilordnetSaksbehandler?.rolle !== SaksbehandlerRolle.OPPGAVE_FINNES_IKKE && (
                        <div>
                            <BodyShort weight={'semibold'} size={'small'}>
                                Ansvarlig saksbehandler:
                            </BodyShort>
                            <BodyShort size={'small'}>
                                {utledVisningsnavn(tilordnetSaksbehandler)}
                            </BodyShort>
                        </div>
                    )}
                    <div style={{ marginLeft: '-1rem', marginTop: '0.5rem' }}>
                        {tilordnetSaksbehandler?.rolle ===
                            SaksbehandlerRolle.OPPGAVE_TILHØRER_IKKE_TILLEGGSSTONADER && (
                            <Alert variant={'warning'} style={{ padding: '1rem' }}>
                                Behandlingens tilhørende oppgave er enten feilregistrert eller satt
                                på et annet tema.
                            </Alert>
                        )}
                    </div>
                </div>
            )}
        </DataViewer>
    );
};

export function utledVisningsnavn(tilordnetSaksbehandler: SaksbehandlerDto | undefined) {
    switch (tilordnetSaksbehandler?.rolle) {
        case SaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER:
        case SaksbehandlerRolle.OPPGAVE_FINNES_IKKE_SANNSYNLIGVIS_INNLOGGET_SAKSBEHANDLER:
        case SaksbehandlerRolle.ANNEN_SAKSBEHANDLER:
            return `${tilordnetSaksbehandler.fornavn} ${tilordnetSaksbehandler.etternavn}`;
        default:
            return 'ingen ansvarlig';
    }
}

export default TilordnetSaksbehandler;
