import { Behandling } from './behandling/behandling';
import { Stønadstype } from './behandling/behandlingTema';
import { valuerOrThrow } from './typeUtils';

export interface FagsakPerson {
    id: string;
    tilsynBarn?: string;
    læremidler?: string;
    boutgifter?: string;
}

export interface FagsakPersonMedBehandlinger {
    id: string;
    tilsynBarn?: Fagsak;
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

export function utledFagsakId(
    stønadstype: Stønadstype,
    fagsakPerson: FagsakPerson
): string | undefined {
    switch (stønadstype) {
        case Stønadstype.BARNETILSYN:
            return fagsakPerson.tilsynBarn;
        case Stønadstype.LÆREMIDLER:
            return fagsakPerson.læremidler;
        case Stønadstype.BOUTGIFTER:
            return fagsakPerson.boutgifter;
    }
}

export function utledFagsakIdEllerKastFeil(
    stønadstype: Stønadstype,
    fagsakPerson: FagsakPerson
): string {
    return valuerOrThrow(utledFagsakId(stønadstype, fagsakPerson));
}
