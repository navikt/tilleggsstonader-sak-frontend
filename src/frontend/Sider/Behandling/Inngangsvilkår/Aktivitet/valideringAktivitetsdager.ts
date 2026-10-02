import { harTallverdi } from '../../../../utils/tall';

export function aktivitetsdagerErGyldigTall(aktivitetsdager: number | undefined): boolean {
    return harTallverdi(aktivitetsdager) && aktivitetsdager >= 1 && aktivitetsdager <= 5;
}

/**
 * Aktivitetsdager er kun påkrevd når man legger til en ny aktivitet,
 * eller når det allerede var satt en verdi på den eksisterende aktiviteten.
 * Ved endring av en eksisterende aktivitet der aktivitetsdager ikke var satt fra før,
 * skal man ikke tvinges til å fylle det inn. Er det derimot fylt ut en verdi
 * (uansett om aktiviteten er ny eller eksisterende) skal verdien fortsatt valideres.
 */
export function skalValidereAktivitetsdager(
    kreverAktivitetsdager: boolean,
    aktivitetsdager: number | undefined
): boolean {
    return kreverAktivitetsdager || harTallverdi(aktivitetsdager);
}
