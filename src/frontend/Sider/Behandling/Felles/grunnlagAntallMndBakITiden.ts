import { Stønadstype } from '../../../typer/behandling/behandlingTema';

/**
 * Brukes for å kunne sette fom på dato for INGEN_MÅLGRUPPE og INGEN_AKTIVITET
 */
export const ingenMålgruppeAktivitetAntallMndBakITiden: Record<Stønadstype, number> = {
    BARNETILSYN: 3,
    LÆREMIDLER: 6,
};

// Kopi av [ingenMålgruppeAktivitetAntallMndBakITiden] men med annet navn for å gjøre det tydligere for konsument
export const stønadsperiodeInnvilgeAntallMndBakITiden = ingenMålgruppeAktivitetAntallMndBakITiden;
