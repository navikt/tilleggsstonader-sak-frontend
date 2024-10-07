import {
    ensligForsørgerStønadstypeTekst,
    PeriodeYtelseRegister,
    registerYtelseTilTekstStorForbokstav,
    TypeRegisterYtelse,
} from '../typer/registerytelser';

export const utledYtelseTekst = (periode: PeriodeYtelseRegister): string => {
    if (periode.type === TypeRegisterYtelse.ENSLIG_FORSØRGER) {
        return periode.ensligForsørgerStønadstype
            ? ensligForsørgerStønadstypeTekst[periode.ensligForsørgerStønadstype]
            : 'Enslig forsørger';
    }
    return `${registerYtelseTilTekstStorForbokstav[periode.type]}${periode.aapErFerdigAvklart ? ' (Ferdig avklart)' : ''}`;
};
