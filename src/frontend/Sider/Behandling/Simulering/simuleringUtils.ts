import { TypeVedtak } from '../../../typer/vedtak';

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
