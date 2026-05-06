import logger from '../../backend/logger';
import { Adressebeskyttelse, Personopplysninger } from '../typer/personopplysninger';

export function søkerHarStrengtFortroligAdresse(personopplysninger: Personopplysninger) {
    if (!personopplysninger) {
        logger.warn('Personopplysninger mangler');
        return false;
    }

    const adressebeskyttelse = personopplysninger.adressebeskyttelse;

    return (
        adressebeskyttelse === Adressebeskyttelse.STRENGT_FORTROLIG ||
        adressebeskyttelse === Adressebeskyttelse.STRENGT_FORTROLIG_UTLAND
    );
}
