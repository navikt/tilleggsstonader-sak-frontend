import { Stønadstype } from './behandling/behandlingTema';
import { valuerOrThrow } from './typeUtils';

export interface FagsakPerson {
    id: string;
    tilsynBarn?: string;
    læremidler?: string;
    boutgifter?: string;
    dagligReiseTso?: string;
    dagligReiseTsr?: string;
    reiseTilSamlingTso?: string;
    reiseTilSamlingTsr?: string;
    flyttingTso?: string;
    flyttingTsr?: string;
    støtteTilReiseOppstartAvslutningHjemreiseTso?: string;
    støtteTilReiseOppstartAvslutningHjemreiseTsr?: string;
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
        case Stønadstype.REISE_TIL_SAMLING_TSO:
            return fagsakPerson.reiseTilSamlingTso;
        case Stønadstype.REISE_TIL_SAMLING_TSR:
            return fagsakPerson.reiseTilSamlingTsr;
        case Stønadstype.FLYTTING_TSO:
            return fagsakPerson.flyttingTso;
        case Stønadstype.FLYTTING_TSR:
            return fagsakPerson.flyttingTsr;
        case Stønadstype.STØTTE_TIL_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO:
            return fagsakPerson.støtteTilReiseOppstartAvslutningHjemreiseTso;
        case Stønadstype.STØTTE_TIL_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR:
            return fagsakPerson.støtteTilReiseOppstartAvslutningHjemreiseTsr;
    }
}

export function utledFagsakIdEllerKastFeil(
    stønadstype: Stønadstype,
    fagsakPerson: FagsakPerson
): string {
    return valuerOrThrow(utledFagsakId(stønadstype, fagsakPerson));
}
