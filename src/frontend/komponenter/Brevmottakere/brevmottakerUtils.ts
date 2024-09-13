import { v4 as uuidv4 } from 'uuid';

import { EBrevmottakerRolle, IBrevmottaker } from './typer';
import { Fullmakt, Vergemål } from '../../Sider/Klage/typer/personopplysningerFraKlage';

export const vergemålTilBrevmottaker = (vergemål: Vergemål): IBrevmottaker => ({
    id: uuidv4(),
    navn: vergemål.navn || '',
    personIdent: vergemål.motpartsPersonident || '',
    mottakerRolle: EBrevmottakerRolle.VERGE,
});
export const fullmaktTilBrevMottaker = (fullmakt: Fullmakt): IBrevmottaker => ({
    id: uuidv4(),
    navn: fullmakt.navn || '',
    personIdent: fullmakt.motpartsPersonident,
    mottakerRolle: EBrevmottakerRolle.FULLMAKT,
});
