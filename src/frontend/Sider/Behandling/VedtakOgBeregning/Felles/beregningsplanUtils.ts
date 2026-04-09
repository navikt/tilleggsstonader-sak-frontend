import { Beregningsplan, BeregningsplanOmfang } from '../../../../typer/vedtak/beregningsplan';

export const skalViseBeregningsresultat = (beregningsplan: Beregningsplan): boolean =>
    beregningsplan.omfang !== BeregningsplanOmfang.GJENBRUK_FORRIGE_RESULTAT;
