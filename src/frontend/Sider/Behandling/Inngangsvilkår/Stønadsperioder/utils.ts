import { Stønadsperiode } from '../typer/stønadsperiode';

export const finnStønadsperiodeIListe = (
    stønadsperiode: Stønadsperiode,
    stønadsperiodeListe: Stønadsperiode[]
) => {
    return stønadsperiodeListe.find((periode) => periode.id === stønadsperiode.id);
};
