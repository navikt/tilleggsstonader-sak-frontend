import { EndreAktivitetForm } from './EndreAktivitetRad';

export const nyAktivitet = (behandlingId: string): EndreAktivitetForm => {
    return {
        behandlingId: behandlingId,
        type: '',
        fom: '',
        tom: '',
        aktivitetsdager: 5,
        delvilkår: { '@type': 'AKTIVITET' },
    };
};
