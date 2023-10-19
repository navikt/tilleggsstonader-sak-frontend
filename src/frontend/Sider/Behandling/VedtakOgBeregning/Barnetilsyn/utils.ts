import { Stønadsperiode, Utgift, Utgiftsperiode } from '../../../../typer/vedtak';
import { Barn } from '../../vilkår';

export const tomUtgiftsperiodeRad = (): Utgiftsperiode => ({
    fra: '',
    til: '',
    periodetype: undefined,
    aktivitetstype: undefined,
    antallAktivitetsdager: undefined,
    barn: [],
    utgifter: undefined,
    dagerMedTilsyn: undefined,
});

export const tomStønadsperiodeRad = (): Stønadsperiode => ({
    fra: '',
    til: '',
});

export const tomUtgiftPerBarn = (barnIBehandling: Barn[]): Record<string, Utgift[]> =>
    barnIBehandling.reduce((acc, barn) => {
        return { ...acc, [barn.barnId]: [tomUtgiftRad()] };
    }, {});

export const tomUtgiftRad = () => ({
    fra: '',
    til: '',
});
