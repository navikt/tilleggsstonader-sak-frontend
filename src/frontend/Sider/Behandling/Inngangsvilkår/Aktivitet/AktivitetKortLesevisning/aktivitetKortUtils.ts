import { Registeraktivitet } from '../../../../../typer/registeraktivitet';
import { Aktivitet } from '../../typer/vilkårperiode/aktivitet';

// Beskriver felter som kan være ulike mellom en aktivitet og en registeraktivitet
enum KeysMedMuligeUlikheter {
    fom = 'fom',
    tom = 'tom',
    prosent = 'prosent',
    aktivitetsdager = 'aktivitetsdager',
}

const KeysMedMuligeUlikheterTilRegisteraktivitetKey: Record<
    KeysMedMuligeUlikheter,
    keyof Registeraktivitet
> = {
    fom: 'fom',
    tom: 'tom',
    prosent: 'prosentDeltakelse',
    aktivitetsdager: 'antallDagerPerUke',
};

export const keysMedMuligeUlikheterTilTekst: Record<KeysMedMuligeUlikheter, string> = {
    fom: 'startdato',
    tom: 'sluttdato',
    prosent: 'prosent',
    aktivitetsdager: 'aktivitetsdager',
};

// Finner forskjeller mellom en aktivitet og en registeraktivitet
// Fellesfelter (fom og tom) ligger direkte på aktiviteten, mens detaljer ligger i faktaOgVurderinger
export const finnForskjellerMellomRegisterOgAktivitet = (
    aktivitet: Aktivitet,
    registerAktivitet: Registeraktivitet
): KeysMedMuligeUlikheter[] => {
    const forskjeller: KeysMedMuligeUlikheter[] = [];

    Object.keys(KeysMedMuligeUlikheter).forEach((key) => {
        const keyIRegisteraktivitet =
            KeysMedMuligeUlikheterTilRegisteraktivitetKey[key as KeysMedMuligeUlikheter];

        if (key in aktivitet && key in registerAktivitet) {
            if (aktivitet[key as keyof Aktivitet] !== registerAktivitet[keyIRegisteraktivitet]) {
                forskjeller.push(key as KeysMedMuligeUlikheter);
            }
        } else if (
            key in aktivitet.faktaOgVurderinger &&
            keyIRegisteraktivitet in registerAktivitet
        ) {
            if (
                aktivitet.faktaOgVurderinger[key as keyof Aktivitet['faktaOgVurderinger']] !==
                registerAktivitet[keyIRegisteraktivitet]
            ) {
                forskjeller.push(key as KeysMedMuligeUlikheter);
            }
        }
    });

    return forskjeller;
};
