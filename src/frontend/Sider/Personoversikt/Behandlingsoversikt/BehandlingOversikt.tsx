import React, { useEffect } from 'react';

import { Alert } from '@navikt/ds-react';

import { TabellBehandling } from './BehandlingTabell';
import { FagsakOversikt } from './FagsakOversikt';
import { useHentFagsakPersonUtvidet } from '../../../hooks/useFagsakPerson';
import { useHentKlagebehandlinger } from '../../../hooks/useKlagebehandlinger';
import DataViewer from '../../../komponenter/DataViewer';
import { Behandling } from '../../../typer/behandling/behandling';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { KlageBehandling } from '../../../typer/klage';
import { erFeilressurs, pakkUtHvisSuksess } from '../../../typer/ressurs';
import { sorterBehandlinger } from '../../../utils/behandlingutil';

const Behandlingsoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { hentFagsakPerson, fagsakPerson } = useHentFagsakPersonUtvidet();
    const { hentKlagebehandlinger, klagebehandlinger } = useHentKlagebehandlinger();

    useEffect(() => {
        hentFagsakPerson(fagsakPersonId);
        hentKlagebehandlinger(fagsakPersonId);
    }, [fagsakPersonId, hentFagsakPerson, hentKlagebehandlinger]);

    const rekjørHentKlagebehandlinger = () => hentKlagebehandlinger(fagsakPersonId);
    const rekjørHentBehandlinger = () => hentFagsakPerson(fagsakPersonId);

    const mapFagsakPersonRessursTilTabellBehandling = (
        behandlinger: Behandling[] | undefined
    ): TabellBehandling[] => {
        const tabellBehandlinger = behandlinger?.map((behandling) => {
            return {
                id: behandling.id,
                opprettet: behandling.opprettet,
                type: behandling.type,
                behandlingsårsak: behandling.behandlingsårsak,
                status: behandling.status,
                vedtaksdato: behandling.vedtaksdato,
                resultat: behandling.resultat,
            };
        });
        return tabellBehandlinger ? tabellBehandlinger : [];
    };

    const mapKlagesakRessursTilTabellBehandling = (
        klageBehandlinger: KlageBehandling[] | undefined
    ): TabellBehandling[] => {
        const tabellBehandlinger = klageBehandlinger?.map((klageBehandling) => {
            return {
                id: klageBehandling.id,
                opprettet: klageBehandling.opprettet,
                type: BehandlingType.KLAGE,
                behandlingsårsak: klageBehandling.årsak,
                status: klageBehandling.status,
                vedtaksdato: klageBehandling.vedtaksdato,
                resultat: klageBehandling.resultat,
            };
        });
        return tabellBehandlinger ? tabellBehandlinger : [];
    };

    const tabellBehandlinger = [
        ...mapFagsakPersonRessursTilTabellBehandling(
            pakkUtHvisSuksess(fagsakPerson)?.data.tilsynBarn?.behandlinger
        ),
        ...mapKlagesakRessursTilTabellBehandling(
            pakkUtHvisSuksess(klagebehandlinger)?.data.barnetilsyn
        ),
    ].sort(sorterBehandlinger);

    return (
        <>
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
