import { Utgiftsperiode } from '../../../../typer/vedtak';

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
