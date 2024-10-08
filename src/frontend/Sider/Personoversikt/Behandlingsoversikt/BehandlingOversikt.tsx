import React, { useEffect } from 'react';

import { Alert, Heading } from '@navikt/ds-react';

import { FagsakOversikt } from './FagsakOversikt';
import { useHentFagsakPersonUtvidet } from '../../../hooks/useFagsakPerson';
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
    const { hentFagsakPerson, fagsakPerson } = useHentFagsakPersonUtvidet();
    const { hentKlagebehandlinger, klagebehandlinger } = useHentKlagebehandlinger();

    useEffect(() => {
        hentFagsakPerson(fagsakPersonId);
        hentKlagebehandlinger(fagsakPersonId);
    }, [fagsakPersonId, hentFagsakPerson, hentKlagebehandlinger]);

    const rekjørHentKlagebehandlinger = () => hentKlagebehandlinger(fagsakPersonId);
    const rekjørHentBehandlinger = () => hentFagsakPerson(fagsakPersonId);

    const tabellBehandlinger = [
        ...mapFagsakPersonTilTabellrader(pakkUtHvisSuksess(fagsakPerson)?.tilsynBarn?.behandlinger),
        ...mapKlagesakerTilTabellrader(pakkUtHvisSuksess(klagebehandlinger)?.barnetilsyn),
    ].sort(sorterBehandlinger);

    return (
        <>
            <Heading size="small">Behandlinger i TS-sak</Heading>
            <DataViewer response={{ fagsakPerson }}>
                {({ fagsakPerson }) => (
                    <>
                        {fagsakPerson.tilsynBarn && (
                            <FagsakOversikt
                                fagsakId={fagsakPerson.tilsynBarn.id}
                                stønadstype={Stønadstype.BARNETILSYN}
                                fagsakEskternID={fagsakPerson.tilsynBarn.eksternId}
                                fagsakErLøpende={fagsakPerson.tilsynBarn.erLøpende}
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
