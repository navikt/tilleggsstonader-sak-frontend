import { AppEnv } from '../../utils/env';
import { Saksbehandler } from '../../utils/saksbehandler';
import { kanBehandleForNay, kanBehandleForTiltaksenheten } from '../../utils/tilganger';

export enum BehandlendeEnhet {
    NAY = 'NAY',
    TILTAKSENHETEN = 'TILTAKSENHETEN',
}
export enum Stønadstype {
    BARNETILSYN = 'BARNETILSYN',
    LÆREMIDLER = 'LÆREMIDLER',
    BOUTGIFTER = 'BOUTGIFTER',
    DAGLIG_REISE_TSO = 'DAGLIG_REISE_TSO',
    DAGLIG_REISE_TSR = 'DAGLIG_REISE_TSR',
    REISE_TIL_SAMLING_TSO = 'REISE_TIL_SAMLING_TSO',
}

export const stønadstypeTilTekst: Record<Stønadstype, string> = {
    BARNETILSYN: 'Pass av barn',
    LÆREMIDLER: 'Læremidler',
    BOUTGIFTER: 'Bolig/overnatting',
    DAGLIG_REISE_TSO: 'Daglige reiser (Nay)',
    DAGLIG_REISE_TSR: 'Daglige reiser (Tiltaksenheten)',
    REISE_TIL_SAMLING_TSO: 'Reise til samling (Nay)',
};

const stønadstypeTilEnhet: Record<Stønadstype, BehandlendeEnhet> = {
    [Stønadstype.BARNETILSYN]: BehandlendeEnhet.NAY,
    [Stønadstype.LÆREMIDLER]: BehandlendeEnhet.NAY,
    [Stønadstype.BOUTGIFTER]: BehandlendeEnhet.NAY,
    [Stønadstype.DAGLIG_REISE_TSO]: BehandlendeEnhet.NAY,
    [Stønadstype.REISE_TIL_SAMLING_TSO]: BehandlendeEnhet.NAY,
    [Stønadstype.DAGLIG_REISE_TSR]: BehandlendeEnhet.TILTAKSENHETEN,
};

export const stønadstypeTilTekstUtenBehandlendeEnhet: Record<Stønadstype, string> = {
    ...stønadstypeTilTekst,
    DAGLIG_REISE_TSO: 'Daglige reiser',
    DAGLIG_REISE_TSR: 'Daglige reiser',
};

function finnEnheterSaksbehandlerKanBehandleFor(
    saksbehandler: Saksbehandler,
    appEnv: AppEnv
): BehandlendeEnhet[] {
    const enheter: BehandlendeEnhet[] = [];
    if (kanBehandleForNay(saksbehandler, appEnv)) {
        enheter.push(BehandlendeEnhet.NAY);
    }
    if (kanBehandleForTiltaksenheten(saksbehandler, appEnv)) {
        enheter.push(BehandlendeEnhet.TILTAKSENHETEN);
    }
    return enheter;
}
export function hentStønadstyperSaksbehandlerKanBehandle(
    saksbehandler: Saksbehandler,
    appEnv: AppEnv
): Stønadstype[] {
    const enheter = finnEnheterSaksbehandlerKanBehandleFor(saksbehandler, appEnv);
    return Object.values(Stønadstype).filter((type) => enheter.includes(stønadstypeTilEnhet[type]));
}
