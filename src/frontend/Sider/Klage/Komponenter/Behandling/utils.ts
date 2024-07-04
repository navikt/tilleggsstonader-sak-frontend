import {
    Klagebehandling,
    BehandlingResultat,
    behandlingResultatTilTekst,
    StegType,
} from '../../App/typer/fagsak';
import { utledTekstForEksternutfall } from './Resultat/utils';

/**
 * Forenklet utledning av stegutfall
 * Denne skal ikke brukes for formkrav eller vurdering hvis resultat = Henlagt
 */
export const utledStegutfallForFerdigstiltBehandling = (behandling: Klagebehandling, steg: StegType) => {
    switch (steg) {
        case StegType.FORMKRAV:
            return behandling.resultat === BehandlingResultat.IKKE_MEDHOLD_FORMKRAV_AVVIST
                ? 'Ikke oppfylt'
                : 'Oppfylt';
        case StegType.VURDERING:
            return behandling.resultat === BehandlingResultat.MEDHOLD
                ? 'Omgjør vedtak'
                : 'Oppretthold vedtak';
        case StegType.BEHANDLING_FERDIGSTILT:
            return behandling.resultat === BehandlingResultat.IKKE_MEDHOLD
                ? utledTekstForEksternutfall(behandling) || ''
                : behandlingResultatTilTekst[behandling.resultat];
        default:
            return '';
    }
};
