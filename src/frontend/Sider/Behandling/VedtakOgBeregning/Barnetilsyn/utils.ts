import { Stønadsperiode, Utgift } from '../../../../typer/vedtak';
import { Barn } from '../../vilkår';

export const tomStønadsperiodeRad = (): Stønadsperiode => ({
    fom: '',
    tom: '',
});

export const tomUtgiftPerBarn = (barnIBehandling: Barn[]): Record<string, Utgift[]> =>
    barnIBehandling.reduce((acc, barn) => {
        return { ...acc, [barn.barnId]: [tomUtgiftRad()] };
    }, {});

export const tomUtgiftRad = (): Utgift => ({
    fom: '',
    tom: '',
});

export const lagVedtakRequest = (
    form: FormState<InnvilgeVedtakForm>
): InnvilgeVedtakForBarnetilsyn => {
    return {
        stønadsperioder: form.stønadsperioder,
        utgifter: form.utgifter,
        _type: VedtakType.InnvilgelseBarnetilsyn,
        resultatType: BehandlingResultat.INNVILGET,
    };
};
