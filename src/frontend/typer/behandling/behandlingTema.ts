import { AppEnv } from '../../utils/env';
import { Saksbehandler } from '../../utils/saksbehandler';
import {
    kanBehandleForNayUtenSøker,
    kanBehandleForTiltaksenhetenUtenSøker,
} from '../../utils/tilganger';

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
    BARNETILSYN: 'Tilsyn barn',
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

export const hentStønadstyperSaksbehandlerKanBehandle = (
    saksbehandler: Saksbehandler,
    appEnv: AppEnv
): Stønadstype[] => {
    const kanBehandleAvNay = kanBehandleForNayUtenSøker(saksbehandler, appEnv);

    const kanBehandleAvTiltaksenhetenUten = kanBehandleForTiltaksenhetenUtenSøker(
        saksbehandler,
        appEnv
    );
    return Object.values(Stønadstype).filter((type) => {
        const enhetSomKanBehandleStønadstype = stønadstypeTilEnhet[type];

        switch (enhetSomKanBehandleStønadstype) {
            case BehandlendeEnhet.NAY:
                return kanBehandleAvNay;
            case BehandlendeEnhet.TILTAKSENHETEN:
                return kanBehandleAvTiltaksenhetenUten;
            default:
                throw new Error(`Ukjent behandlende enhet: ${enhetSomKanBehandleStønadstype}`);
        }
    });
};
