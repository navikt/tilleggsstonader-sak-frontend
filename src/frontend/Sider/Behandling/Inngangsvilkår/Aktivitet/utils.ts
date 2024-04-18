import { EndreAktivitetForm } from './EndreAktivitetRad';
import { AktivitetType, DelvilkårAktivitet } from '../typer/aktivitet';

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

export const skalVurdereLønnet = (type: AktivitetType | '') => type === AktivitetType.TILTAK;

export const resetDelvilkår = (
    type: AktivitetType,
    delvilkår: DelvilkårAktivitet
): DelvilkårAktivitet => ({
    ...delvilkår,
    lønnet: skalVurdereLønnet(type) ? delvilkår.lønnet : undefined,
    // fjerner ikke mottarSykepenger då den alltid skal vurderes
});
