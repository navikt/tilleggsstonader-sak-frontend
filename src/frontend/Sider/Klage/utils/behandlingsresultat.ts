import { KlagebehandlingResultat } from '../typer/klagebehandling/klagebehandlingResultat';
import { Klagebehandling } from '../typer/klagebehandling/klagebehandling';
import { KlageinstansEventType, KlageinstansUtfall } from '../../../typer/klage';
import { KlagebehandlingSteg } from '../typer/klagebehandling/klagebehandlingSteg';

export const behandlingResultatTilTekst: Record<KlagebehandlingResultat, string> = {
    MEDHOLD: 'Medhold',
    IKKE_MEDHOLD: 'Ikke medhold',
    IKKE_MEDHOLD_FORMKRAV_AVVIST: 'Ikke medhold formkrav avvist',
    IKKE_SATT: 'Ikke satt',
    HENLAGT: 'Henlagt',
};

export const utfallTilTekst: Record<KlageinstansUtfall, string> = {
    TRUKKET: 'Trukket KA',
    RETUR: 'Retur KA',
    OPPHEVET: 'Opphevet KA',
    MEDHOLD: 'Medhold KA',
    DELVIS_MEDHOLD: 'Delvis medhold KA',
    STADFESTELSE: 'Stadfestelse KA',
    UGUNST: 'Ugunst (Ugyldig) KA',
    AVVIST: 'Avvist KA',
    INNSTILLING_STADFESTELSE: 'Innstilling om stadfestelse til trygderetten fra KA',
    INNSTILLING_AVVIST: 'Innstilling om avist til trygderetten fra KA',
};

export const utledTekstForEksternutfall = (behandling: Klagebehandling) => {
    const erFeilregistrert = behandling.klageinstansResultat.some(
        (resultat) => resultat.type === KlageinstansEventType.BEHANDLING_FEILREGISTRERT
    );

    if (erFeilregistrert) {
        return 'Behandling feilregistrert';
    }

    const klageResultatMedUtfall = behandling.klageinstansResultat.filter(
        (resultat) =>
            resultat.utfall && resultat.type == KlageinstansEventType.KLAGEBEHANDLING_AVSLUTTET
    );
    if (klageResultatMedUtfall.length > 0) {
        const utfall = klageResultatMedUtfall[0];
        if (utfall.utfall) {
            return utfallTilTekst[utfall.utfall];
        }
    }
};

export const utledTekstForBehandlingsresultat = (behandling: Klagebehandling) => {
    const eksternUtfallTekst = utledTekstForEksternutfall(behandling);
    return eksternUtfallTekst
        ? eksternUtfallTekst
        : behandlingResultatTilTekst[behandling.resultat];
};


/**
 * Forenklet utledning av stegutfall
 * Denne skal ikke brukes for formkrav eller vurdering hvis resultat = Henlagt
 */
export const utledStegutfall = (
    behandling: Klagebehandling,
    steg: KlagebehandlingSteg
) => {
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