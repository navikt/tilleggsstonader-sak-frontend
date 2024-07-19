import { EBrevmottakerRolle, IBrevmottaker } from './typer';
import { Fullmakt, Vergemål } from '../../Sider/Klage/typer/personopplysningerFraKlage';

export const vergemålTilBrevmottaker = (vergemål: Vergemål): IBrevmottaker => ({
    navn: vergemål.navn || '',
    personIdent: vergemål.motpartsPersonident || '',
    mottakerRolle: EBrevmottakerRolle.VERGE,
});
export const fullmaktTilBrevMottaker = (fullmakt: Fullmakt): IBrevmottaker => ({
    navn: fullmakt.navn || '',
    personIdent: fullmakt.motpartsPersonident,
    mottakerRolle: EBrevmottakerRolle.FULLMAKT,
});
