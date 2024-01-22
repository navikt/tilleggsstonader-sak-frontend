import { EndreAktivitetForm } from './EndreAktivitetRad';

export const nyAktivitet = (behandlingId: string): EndreAktivitetForm => {
    return {
        behandlingId: behandlingId,
        type: '',
        fom: '',
        tom: '',
        delvilkår: { '@type': 'AKTIVITET' },
    };
};
