import {
    Klagebehandling,
    KlagebehandlingSteg,
} from '../../App/typer/klagebehandling/klagebehandling';
import { utledTekstForEksternutfall } from './Resultat/utils';
import {
    behandlingResultatTilTekst,
    KlagebehandlingResultat,
} from '../../App/typer/klagebehandling/klagebehandlingResultat';


/**
 * Forenklet utledning av stegutfall
 * Denne skal ikke brukes for formkrav eller vurdering hvis resultat = Henlagt
 */
export const utledStegutfallForFerdigstiltBehandling = (behandling: Klagebehandling, steg: KlagebehandlingSteg) => {
    switch (steg) {
        case KlagebehandlingSteg.FORMKRAV:
            return behandling.resultat === KlagebehandlingResultat.IKKE_MEDHOLD_FORMKRAV_AVVIST
                ? 'Ikke oppfylt'
                : 'Oppfylt';
        case KlagebehandlingSteg.VURDERING:
            return behandling.resultat === KlagebehandlingResultat.MEDHOLD
                ? 'Omgjør vedtak'
                : 'Oppretthold vedtak';
        case KlagebehandlingSteg.BEHANDLING_FERDIGSTILT:
            return behandling.resultat === KlagebehandlingResultat.IKKE_MEDHOLD
                ? utledTekstForEksternutfall(behandling) || ''
                : behandlingResultatTilTekst[behandling.resultat];
        default:
            return '';
    }
};
