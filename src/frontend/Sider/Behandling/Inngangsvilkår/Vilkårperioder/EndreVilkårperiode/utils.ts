import { EndreAktivitetForm } from '../../Aktivitet/EndreAktivitetRad';
import { erFormForAktivitet, finnBegrunnelseGrunnerAktivitet } from '../../Aktivitet/utils';
import { EndreMålgruppeForm } from '../../Målgruppe/EndreMålgruppeRad';
import { erFormForMålgruppe, finnBegrunnelseGrunnerMålgruppe } from '../../Målgruppe/utils';

export enum BegrunnelseGrunner {
    MEDLEMSKAP = 'MEDLEMSKAP',
    DEKKET_AV_ANNET_REGELVERK = 'DEKKET_AV_ANNET_REGELVERK',
    NEDSATT_ARBEIDSEVNE = 'NEDSATT_ARBEIDSEVNE',
    LØNNET = 'LØNNET',
    INGEN_AKTIVITET = 'INGEN_AKTIVITET',
    INGEN_MÅLGRUPPE = 'INGEN_MÅLGRUPPE',
}

export const begrunnelseTilTekst: Record<BegrunnelseGrunner, string> = {
    MEDLEMSKAP: 'Medlemskap',
    DEKKET_AV_ANNET_REGELVERK: 'Utgifter dekket av annet regelverk',
    NEDSATT_ARBEIDSEVNE: 'Nedsatt arbeidsevne',
    LØNNET: 'Ordinær lønn i tiltaket',
    INGEN_AKTIVITET: 'Ingen aktivitet',
    INGEN_MÅLGRUPPE: 'Ingen målgruppe',
};

export const finnBegrunnelseGrunner = (
    vilkårperiodeForm: EndreMålgruppeForm | EndreAktivitetForm
): BegrunnelseGrunner[] => {
    if (erFormForAktivitet(vilkårperiodeForm)) {
        return finnBegrunnelseGrunnerAktivitet(vilkårperiodeForm.type, vilkårperiodeForm.delvilkår);
    } else if (erFormForMålgruppe(vilkårperiodeForm)) {
        return finnBegrunnelseGrunnerMålgruppe(vilkårperiodeForm.type, vilkårperiodeForm.delvilkår);
    } else return [];
};
