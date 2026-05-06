import { AppEnv } from '../../utils/env';
import { Saksbehandler } from '../../utils/saksbehandler';
import { kanBehandleForNay, kanBehandleForTiltaksenheten } from '../../utils/tilganger';
import { Personopplysninger } from '../personopplysninger';

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

export const stønadstypeTilTekstUtenBehandlendeEnhet: Record<Stønadstype, string> = {
    ...stønadstypeTilTekst,
    DAGLIG_REISE_TSO: 'Daglige reiser',
    DAGLIG_REISE_TSR: 'Daglige reiser',
};

export const hentTilgjengeligeStønadstyper = (
    saksbehandler: Saksbehandler,
    personopplysninger: Personopplysninger,
    appEnv: AppEnv
): Stønadstype[] => {
    const kanBehandleNAY = kanBehandleForNay(saksbehandler, personopplysninger, appEnv);

    const kanBehandleTSR = kanBehandleForTiltaksenheten(saksbehandler, personopplysninger, appEnv);

    return Object.values(Stønadstype).filter((type) => {
        if (kanBehandleNAY && !kanBehandleTSR) {
            return type !== Stønadstype.DAGLIG_REISE_TSR;
        }
        if (kanBehandleTSR && !kanBehandleNAY) {
            return (
                type !== Stønadstype.DAGLIG_REISE_TSO && type !== Stønadstype.REISE_TIL_SAMLING_TSO
            );
        }
        return true;
    });
};
