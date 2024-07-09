import React, { useEffect } from 'react';

import { TabellBehandling } from './BehandlingTabell';
import { FagsakOversikt } from './FagsakOversikt';
import { useHentFagsakPersonUtvidet } from '../../../hooks/useFagsakPerson';
import { useHentKlagebehandlinger } from '../../../hooks/useKlagebehandlinger';
import DataViewer from '../../../komponenter/DataViewer';
import { Behandling } from '../../../typer/behandling/behandling';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { FagsakPersonMedBehandlinger } from '../../../typer/fagsak';
import { KlageBehandling, Klagebehandlinger } from '../../../typer/klage';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
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

    const feilHaandteringAvTabellBehandlinger = (
        fagsakPersonRessurs: Ressurs<FagsakPersonMedBehandlinger>,
        klagebehandlingerRessurs: Ressurs<Klagebehandlinger>
    ): TabellBehandling[] => {
        let tabellBehandlingerFraFagsak: TabellBehandling[] = [];
        if (fagsakPersonRessurs.status === RessursStatus.SUKSESS) {
            tabellBehandlingerFraFagsak = mapFagsakPersonRessursTilTabellBehandling(
                fagsakPersonRessurs.data.tilsynBarn?.behandlinger
            );
        }

        let tabellBehandlingerFraKlagesaker: TabellBehandling[] = [];
        if (klagebehandlingerRessurs.status === RessursStatus.SUKSESS) {
            tabellBehandlingerFraKlagesaker = mapKlagesakRessursTilTabellBehandling(
                klagebehandlingerRessurs.data.barnetilsyn
            );
        }

        return tabellBehandlingerFraFagsak
            .concat(tabellBehandlingerFraKlagesaker)
            .sort(sorterBehandlinger);
    };

    const tabellBehandlinger: TabellBehandling[] = feilHaandteringAvTabellBehandlinger(
        fagsakPerson,
        klagebehandlinger
    );

    return (
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
    );
};

export default Behandlingsoversikt;
