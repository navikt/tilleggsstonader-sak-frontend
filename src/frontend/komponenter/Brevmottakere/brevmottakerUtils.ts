import { v4 as uuidv4 } from 'uuid';

import { EBrevmottakerRolle, IBrevmottaker } from './typer';
import { Vergemål } from '../../Sider/Klage/typer/personopplysningerFraKlage';
import { FullmektigDto } from '../../typer/fullmakt';

export const vergemålTilBrevmottaker = (vergemål: Vergemål): IBrevmottaker => ({
    id: uuidv4(),
    navn: vergemål.navn || '',
    personIdent: vergemål.motpartsPersonident || '',
    mottakerRolle: EBrevmottakerRolle.VERGE,
});

export const fullmektigDtoTilBrevMottaker = (fullmektig: FullmektigDto): IBrevmottaker => ({
    id: uuidv4(),
    navn: fullmektig.fullmektigNavn || '',
    personIdent: fullmektig.fullmektigIdent,
    mottakerRolle: EBrevmottakerRolle.FULLMAKT,
});
