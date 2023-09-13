import { Behandling } from './behandling/behandling';
import { Stønadstype } from './behandling/behandlingTema';

export interface FagsakPersonMedBehandlinger {
    id: string;
    barnetilsyn?: Fagsak;
}

export interface Fagsak {
    id: string;
    eksternId: number;
    fagsakPersonId: string;
    personIdent: string;
    stønadstype: Stønadstype;
    erLøpende: boolean;
    behandlinger: Behandling[];
}
