import { Stønadstype } from './behandling/behandlingTema';
import { valuerOrThrow } from './typeUtils';

export interface FagsakPerson {
    id: string;
    tilsynBarn?: string;
    læremidler?: string;
    boutgifter?: string;
    dagligReiseTso?: string;
    dagligReiseTsr?: string;
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
        case Stønadstype.DAGLIG_REISE_TSO:
            return fagsakPerson.dagligReiseTso;
        case Stønadstype.DAGLIG_REISE_TSR:
            return fagsakPerson.dagligReiseTsr;
    }
}

export function utledFagsakIdEllerKastFeil(
    stønadstype: Stønadstype,
    fagsakPerson: FagsakPerson
): string {
    return valuerOrThrow(utledFagsakId(stønadstype, fagsakPerson));
}
