import { Adressebeskyttelse, Personopplysninger } from '../typer/personopplysninger';

export function søkerHarStrengtFortroligAdresse(personopplysninger: Personopplysninger) {
    return (
        personopplysninger.adressebeskyttelse === Adressebeskyttelse.STRENGT_FORTROLIG ||
        personopplysninger.adressebeskyttelse === Adressebeskyttelse.STRENGT_FORTROLIG_UTLAND
    );
}
