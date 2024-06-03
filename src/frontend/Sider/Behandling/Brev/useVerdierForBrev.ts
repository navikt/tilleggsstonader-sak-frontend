import { BeregningsresultatTilsynBarn } from '../../../typer/vedtak';
import { formaterDato, tilDato } from '../../../utils/dato';

export type VariabelStore = { [variabelId: string]: string };

export type Brevverdier = {
    variabelStore: VariabelStore;
};

function utledStørsteTomdato(
    beregningsresultat: BeregningsresultatTilsynBarn | undefined
): Date | undefined {
    const alleTomDatoer =
        beregningsresultat?.perioder.flatMap((periode) =>
            periode.grunnlag.stønadsperioderGrunnlag.map((grunnlag) =>
                tilDato(grunnlag.stønadsperiode.tom).getTime()
            )
        ) || [];

    return alleTomDatoer.length > 0 ? new Date(Math.max(...alleTomDatoer)) : undefined;
}

function utledMinsteFomdato(
    beregningsresultat: BeregningsresultatTilsynBarn | undefined
): Date | undefined {
    const alleFomDatoer =
        beregningsresultat?.perioder.flatMap((periode) =>
            periode.grunnlag.stønadsperioderGrunnlag.map((grunnlag) =>
                tilDato(grunnlag.stønadsperiode.fom).getTime()
            )
        ) || [];
    return alleFomDatoer.length > 0 ? new Date(Math.min(...alleFomDatoer)) : undefined;
}

export const useVerdierForBrev = (
    beregningsresultat?: BeregningsresultatTilsynBarn
): Brevverdier => {
    const variabelIdVedtakFraDato = 'f194e1fa-ba7a-4338-96fb-1d2b1a586dd3';
    const VariabelIdVedtakTilDato = 'e67f3fe5-a318-447b-97c4-1495c132b61e';

    const størsteTomDato = utledStørsteTomdato(beregningsresultat);
    const minsteFomDato = utledMinsteFomdato(beregningsresultat);

    return {
        variabelStore: {
            [variabelIdVedtakFraDato]: formaterDato(minsteFomDato) || '',
            [VariabelIdVedtakTilDato]: formaterDato(størsteTomDato) || '',
        },
    };
};
