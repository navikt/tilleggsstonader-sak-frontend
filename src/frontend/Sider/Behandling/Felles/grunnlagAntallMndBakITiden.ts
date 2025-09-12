import { Stønadstype } from '../../../typer/behandling/behandlingTema';

/**
 * Definerer standard antall måneder tilbake i tid man kan saksbehandle en søknad.
 * Man beregner antall måneder tilbake fra søknadstidspunktet.
 *
 * Brukes bl.a. for å kunne sette fom på dato for INGEN_MÅLGRUPPE og INGEN_AKTIVITET
 */
export const ingenMålgruppeAktivitetAntallMndBakITiden: Record<Stønadstype, number> = {
    BARNETILSYN: 3,
    LÆREMIDLER: 6,
    BOUTGIFTER: 6,
    //Dette er ikke besluttet funksjonelt for daglig reise,
    // men vi starter med 3 mnd også får vi heller justere opp til 6 mnd ved behov
    DAGLIG_REISE_TSR: 3,
    DAGLIG_REISE_TSO: 3,
};
