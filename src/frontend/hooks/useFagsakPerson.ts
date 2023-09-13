import { useCallback, useState } from 'react';

import { BehandlingResultat } from '../typer/behandling/behandlingResultat';
import { BehandlingStatus } from '../typer/behandling/behandlingStatus';
import { Stønadstype } from '../typer/behandling/behandlingTema';
import { BehandlingType } from '../typer/behandling/behandlingType';
import { BehandlingÅrsak } from '../typer/behandling/behandlingÅrsak';
import { Steg } from '../typer/behandling/steg';
import { FagsakPersonMedBehandlinger } from '../typer/fagsak';
import { Ressurs, RessursStatus, byggTomRessurs } from '../typer/ressurs';

interface HentFagsakPersonResponse {
    hentFagsakPerson: (fagsakPersonId: string) => void;
    fagsakPerson: Ressurs<FagsakPersonMedBehandlinger>;
}

export const useHentFagsakPersonUtvidet = (): HentFagsakPersonResponse => {
    const [fagsakPerson, settFagsakPerson] = useState<Ressurs<FagsakPersonMedBehandlinger>>(
        byggTomRessurs()
    );

    const hentFagsakPerson = useCallback(() => {
        settFagsakPerson({
            status: RessursStatus.SUKSESS,
            data: {
                id: 'fagsakPersonId',
                barnetilsyn: {
                    id: 'fagsakIdBarnetilsyn',
                    eksternId: 123,
                    fagsakPersonId: 'fagsakPersonId',
                    personIdent: 'personIdent',
                    stønadstype: Stønadstype.BARNETILSYN,
                    erLøpende: true,
                    behandlinger: [
                        {
                            id: 'behandlingId',
                            fagsakId: 'fagsakId',
                            type: BehandlingType.FØRSTEGANGSBEHANDLING,
                            steg: Steg.VILKÅR,
                            status: BehandlingStatus.OPPRETTET,
                            sistEndret: '2023-09-12T00:00:00',
                            opprettet: '2023-09-12T00:00:00',
                            opprettetAv: 'saksbehandler',
                            resultat: BehandlingResultat.IKKE_SATT,
                            behandlingsårsak: BehandlingÅrsak.SØKNAD,
                            stønadstype: Stønadstype.BARNETILSYN,
                        },
                    ],
                },
            },
        });
    }, []);

    return {
        hentFagsakPerson,
        fagsakPerson,
    };
};
