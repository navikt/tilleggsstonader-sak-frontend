import { Registeraktivitet } from '../../../../../typer/registeraktivitet';
import { Aktivitet } from '../../typer/vilkårperiode/aktivitet';

// Beskriver felter som kan være ulike mellom en aktivitet og en registeraktivitet
enum KeysMedMuligeUlikheter {
    fom = 'startdato',
    tom = 'sluttdato',
    prosent = 'prosent',
    aktivitetsdager = 'aktivitetsdager',
}

export const finnForskjellerMellomAktivitetOgRegisteraktivitet = (
    aktivitet: Aktivitet,
    registerAktivitet: Registeraktivitet
): KeysMedMuligeUlikheter[] => {
    const forskjeller: KeysMedMuligeUlikheter[] = [];

    if (aktivitet.fom !== registerAktivitet.fom) {
        forskjeller.push(KeysMedMuligeUlikheter.fom);
    }

    if (aktivitet.tom !== registerAktivitet.tom) {
        forskjeller.push(KeysMedMuligeUlikheter.tom);
    }

    if (
        'prosent' in aktivitet.faktaOgVurderinger &&
        aktivitet.faktaOgVurderinger.prosent !== registerAktivitet.prosentDeltakelse
    ) {
        forskjeller.push(KeysMedMuligeUlikheter.prosent);
    }

    if (
        'aktivitetsdager' in aktivitet.faktaOgVurderinger &&
        aktivitet.faktaOgVurderinger.aktivitetsdager !== registerAktivitet.antallDagerPerUke
    ) {
        forskjeller.push(KeysMedMuligeUlikheter.aktivitetsdager);
    }

    return forskjeller;
};
