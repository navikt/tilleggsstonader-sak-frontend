import { TypeVedtak } from '../../../typer/vedtak/vedtak';

export const harVedtaksresultatMedTilkjentYtelse = (
    vedtaksresultat: TypeVedtak | undefined
): boolean => {
    switch (vedtaksresultat) {
        case TypeVedtak.INNVILGELSE:
            return true;
        default:
            return false;
    }
};

export const finnDefaultÅrForSimuleringsvisning = (muligeÅr: number[]) => {
    const inneværendeÅr = new Date().getFullYear();
    if (muligeÅr.includes(inneværendeÅr)) {
        return inneværendeÅr;
    } else if (Math.max(...muligeÅr) < inneværendeÅr) {
        return Math.max(...muligeÅr);
    }
    return Math.min(...muligeÅr);
};
