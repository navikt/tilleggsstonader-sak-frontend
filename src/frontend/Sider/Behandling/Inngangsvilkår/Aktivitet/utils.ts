import { EndreAktivitetForm } from './EndreAktivitetRad';
import { AktivitetType, DelvilkårAktivitet } from '../typer/aktivitet';
import { SvarJaNei } from '../typer/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/EndreVilkårperiode/utils';

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

export const finnBegrunnelseGrunnerAktivitet = (delvilkår: DelvilkårAktivitet) => {
    const delvilkårSomMåBegrunnes = [];

    if (delvilkår.lønnet?.svar === SvarJaNei.JA) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.NEDSATT_ARBEIDSEVNE);
    }

    return delvilkårSomMåBegrunnes;
};

export const harObligatoriskBegrunnelse = (målgruppeForm: EndreAktivitetForm) => {
    const begrunnelseGrunner = finnBegrunnelseGrunnerAktivitet(målgruppeForm.delvilkår);
    return begrunnelseGrunner.length > 0;
};
