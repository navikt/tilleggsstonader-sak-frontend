import { PersonopplysningerIBrevmottakere } from './typer';
import { Personopplysninger } from '../../typer/personopplysninger';

export const mapPersonopplysningerTilPersonopplysningerIBrevmottakere = (
    personopplysninger: Personopplysninger
): PersonopplysningerIBrevmottakere => {
    return {
        personIdent: personopplysninger.personIdent,
        navn: personopplysninger.navn.visningsnavn,
        harVergemål: personopplysninger.harVergemål,
        vergemål: personopplysninger.vergemål,
    };
};
