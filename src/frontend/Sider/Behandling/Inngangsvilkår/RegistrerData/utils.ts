import { MålgruppePeriode, MålgruppeType } from './typer';

export const tomMålgruppeRad = (): MålgruppePeriode => ({
    fom: '',
    tom: '',
    type: MålgruppeType.TILTAK,
});
