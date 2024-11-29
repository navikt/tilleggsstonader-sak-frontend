import { Brevverdier } from './verdier';
import { BeregningsresultatTilsynBarn } from '../../../typer/vedtak/vedtakTilsynBarn';
import { formaterNullableTilTekstligDato } from '../../../utils/dato';

export const lagVerdierTilsynBarn = (
    beregningsresultat?: BeregningsresultatTilsynBarn
): Brevverdier => {
    const variabelIdVedtakFraDato = 'f194e1fa-ba7a-4338-96fb-1d2b1a586dd3';
    const VariabelIdVedtakTilDato = 'e67f3fe5-a318-447b-97c4-1495c132b61e';

    const minsteFomDato = beregningsresultat?.gjelderFraOgMed;
    const størsteTomDato = beregningsresultat?.gjelderTilOgMed;

    return {
        variabelStore: {
            [variabelIdVedtakFraDato]: formaterNullableTilTekstligDato(minsteFomDato) ?? '',
            [VariabelIdVedtakTilDato]: formaterNullableTilTekstligDato(størsteTomDato) ?? '',
        },
    };
};
