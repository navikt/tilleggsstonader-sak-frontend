import { BeregningsresultatTilsynBarn } from '../../../typer/vedtak';
import { formaterNullableIsoDato } from '../../../utils/dato';

export type VariabelStore = { [variabelId: string]: string };

export type Brevverdier = {
    variabelStore: VariabelStore;
};

export const useVerdierForBrev = (
    beregningsresultat?: BeregningsresultatTilsynBarn
): Brevverdier => {
    const variabelIdVedtakFraDato = 'f194e1fa-ba7a-4338-96fb-1d2b1a586dd3';
    const VariabelIdVedtakTilDato = 'e67f3fe5-a318-447b-97c4-1495c132b61e';

    const stønadsperioder = beregningsresultat?.perioder[0].grunnlag.stønadsperioderGrunnlag;

    const fraDato = formaterNullableIsoDato(stønadsperioder?.[0].stønadsperiode.fom) || '';
    const tilDato =
        formaterNullableIsoDato(
            stønadsperioder?.[stønadsperioder?.length - 1].stønadsperiode.tom
        ) || '';

    return {
        variabelStore: {
            [variabelIdVedtakFraDato]: fraDato,
            [VariabelIdVedtakTilDato]: tilDato,
        },
    };
};
