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
    REISE_TIL_SAMLING_TSR = 'REISE_TIL_SAMLING_TSR',
    FLYTTING_TSO = 'FLYTTING_TSO',
    FLYTTING_TSR = 'FLYTTING_TSR',
    REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO = 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO',
    REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR = 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR',
}

export const stønadstypeTilTekst: Record<Stønadstype, string> = {
    BARNETILSYN: 'Pass av barn',
    LÆREMIDLER: 'Læremidler',
    BOUTGIFTER: 'Bolig/overnatting',
    DAGLIG_REISE_TSO: 'Daglige reiser (Nay)',
    DAGLIG_REISE_TSR: 'Daglige reiser (Tiltaksenheten)',
    REISE_TIL_SAMLING_TSO: 'Reise til samling (Nay)',
    REISE_TIL_SAMLING_TSR: 'Reise til samling (Tiltaksenheten)',
    FLYTTING_TSO: 'Flytting (Nay)',
    FLYTTING_TSR: 'Flytting (Tiltaksenheten)',
    // TODO: avklar visningsnavn
    REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO:
        'Støtte til reise ved oppstart, avslutning og hjemreise (Nay)',
    REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR:
        'Støtte til reise ved oppstart, avslutning og hjemreise (Tiltaksenheten)',
};

const stønadstypeTilEnhet: Record<Stønadstype, BehandlendeEnhet> = {
    [Stønadstype.BARNETILSYN]: BehandlendeEnhet.NAY,
    [Stønadstype.LÆREMIDLER]: BehandlendeEnhet.NAY,
    [Stønadstype.BOUTGIFTER]: BehandlendeEnhet.NAY,
    [Stønadstype.DAGLIG_REISE_TSO]: BehandlendeEnhet.NAY,
    [Stønadstype.REISE_TIL_SAMLING_TSO]: BehandlendeEnhet.NAY,
    [Stønadstype.REISE_TIL_SAMLING_TSR]: BehandlendeEnhet.TILTAKSENHETEN,
    [Stønadstype.FLYTTING_TSO]: BehandlendeEnhet.NAY,
    [Stønadstype.DAGLIG_REISE_TSR]: BehandlendeEnhet.TILTAKSENHETEN,
    [Stønadstype.FLYTTING_TSR]: BehandlendeEnhet.TILTAKSENHETEN,
    [Stønadstype.REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO]: BehandlendeEnhet.NAY,
    [Stønadstype.REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR]: BehandlendeEnhet.TILTAKSENHETEN,
};

export const stønadstypeTilTekstUtenBehandlendeEnhet: Record<Stønadstype, string> = {
    ...stønadstypeTilTekst,
    DAGLIG_REISE_TSO: 'Daglige reiser',
    DAGLIG_REISE_TSR: 'Daglige reiser',
    FLYTTING_TSO: 'Flytting',
    FLYTTING_TSR: 'Flytting',
    REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO:
        'Støtte til reise ved oppstart, avslutning og hjemreise',
    REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR:
        'Støtte til reise ved oppstart, avslutning og hjemreise',
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

export const stønadstypeErDagligReise = (stønadstype: Stønadstype) =>
    stønadstype === Stønadstype.DAGLIG_REISE_TSO || stønadstype === Stønadstype.DAGLIG_REISE_TSR;

export const stønadstypeErFlytting = (stønadstype: Stønadstype) =>
    stønadstype === Stønadstype.FLYTTING_TSO || stønadstype === Stønadstype.FLYTTING_TSR;
