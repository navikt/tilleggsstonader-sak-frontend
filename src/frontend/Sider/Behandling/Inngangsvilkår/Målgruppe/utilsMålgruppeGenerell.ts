import { EndreMålgruppeGenerellForm } from './EndreMålgruppeGenerell';
import {
    dekkesAvAnnetRegelverkAutomatiskNeiHvisMangler,
    målgrupperHvorMedlemskapMåVurderes,
    skalVurdereDekkesAvAnnetRegelverk,
} from './utils';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { typeRegisterYtelseTilMålgruppeType } from '../../../../typer/registerytelser';
import { dagensDato, førsteDagIMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { ingenMålgruppeAktivitetAntallMndBakITiden } from '../../Felles/grunnlagAntallMndBakITiden';
import { MålgruppeType } from '../typer/vilkårperiode/målgruppe';
import {
    MålgruppeGenerell,
    MålgruppeGenerellFaktaOgSvar,
    SvarMålgruppeGenerell,
} from '../typer/vilkårperiode/målgruppeGenerell';
import { SvarJaNei, YtelseGrunnlagPeriode } from '../typer/vilkårperiode/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyMålgruppe = (
    registrertYtelsePeriode?: YtelseGrunnlagPeriode
): EndreMålgruppeGenerellForm => {
    return registrertYtelsePeriode
        ? nyMålgruppeFraRegister(registrertYtelsePeriode)
        : tomMålgruppeForm();
};

export const mapEksisterendeMålgruppe = (
    eksisterendeMålgruppe: MålgruppeGenerell
): EndreMålgruppeGenerellForm => ({
    ...eksisterendeMålgruppe,
    vurderinger: {
        svarMedlemskap: eksisterendeMålgruppe.faktaOgVurderinger.medlemskap?.svar,
        svarUtgifterDekketAvAnnetRegelverk:
            eksisterendeMålgruppe.faktaOgVurderinger.utgifterDekketAvAnnetRegelverk?.svar,
    },
});

const nyMålgruppeFraRegister = (
    registrertYtelsePeriode: YtelseGrunnlagPeriode
): EndreMålgruppeGenerellForm => {
    const type = typeRegisterYtelseTilMålgruppeType[registrertYtelsePeriode.type];
    return {
        type: type,
        fom: registrertYtelsePeriode.fom,
        tom: registrertYtelsePeriode.tom || '',
        vurderinger: resetVurderinger(type, tomVurderingerMålgruppe),
    };
};

const tomMålgruppeForm = (): EndreMålgruppeGenerellForm => {
    return {
        type: '',
        fom: '',
        tom: '',
        vurderinger: tomVurderingerMålgruppe,
    };
};

const tomVurderingerMålgruppe = {
    svarMedlemskap: undefined,
    svarUtgifterDekketAvAnnetRegelverk: undefined,
};

export const resettMålgruppe = (
    stønadstype: Stønadstype,
    nyType: MålgruppeType,
    eksisterendeForm: EndreMålgruppeGenerellForm,
    søknadMottattTidspunkt?: string
): EndreMålgruppeGenerellForm => {
    const { fom, tom } = resetPeriode(
        stønadstype,
        nyType,
        eksisterendeForm,
        søknadMottattTidspunkt
    );
    return {
        ...eksisterendeForm,
        type: nyType,
        fom: fom,
        tom: tom,
        vurderinger: resetVurderinger(nyType, eksisterendeForm.vurderinger),
    };
};

const resetPeriode = (
    stønadstype: Stønadstype,
    nyType: string,
    eksisterendeForm: EndreMålgruppeGenerellForm,
    søknadMottattTidspunkt?: string
): Periode => {
    if (nyType === MålgruppeType.INGEN_MÅLGRUPPE) {
        return {
            fom: førsteDagIMånederForut(
                ingenMålgruppeAktivitetAntallMndBakITiden[stønadstype],
                søknadMottattTidspunkt
            ),
            tom: dagensDato(),
        };
    }

    if (eksisterendeForm.type === MålgruppeType.INGEN_MÅLGRUPPE) {
        // Resetter datoer om de forrige var satt automatisk
        return { fom: '', tom: '' };
    }

    return { fom: eksisterendeForm.fom, tom: eksisterendeForm.tom };
};

const resetVurderinger = (
    type: MålgruppeType,
    eksisterendeVurderinger: SvarMålgruppeGenerell
): SvarMålgruppeGenerell => ({
    ...eksisterendeVurderinger,
    svarMedlemskap: målgrupperHvorMedlemskapMåVurderes.includes(type)
        ? eksisterendeVurderinger.svarMedlemskap
        : undefined,
    svarUtgifterDekketAvAnnetRegelverk: skalVurdereDekkesAvAnnetRegelverk(type)
        ? dekkesAvAnnetRegelverkAutomatiskNeiHvisMangler(eksisterendeVurderinger)
        : undefined,
});

export const finnBegrunnelseGrunnerMålgruppe = (
    type: MålgruppeType | '',
    vurderinger: SvarMålgruppeGenerell
) => {
    const delvilkårSomMåBegrunnes = [];

    if (type === MålgruppeType.NEDSATT_ARBEIDSEVNE) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.NEDSATT_ARBEIDSEVNE);
    }

    if (type !== '' && målgrupperHvorMedlemskapMåVurderes.includes(type)) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.MEDLEMSKAP);
    }

    if (type === MålgruppeType.INGEN_MÅLGRUPPE) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.INGEN_MÅLGRUPPE);
    }

    if (type === MålgruppeType.SYKEPENGER_100_PROSENT) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.SYKEPENGER_100_PROSENT);
    }

    if (vurderinger.svarUtgifterDekketAvAnnetRegelverk === SvarJaNei.JA) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.DEKKET_AV_ANNET_REGELVERK);
    }

    return delvilkårSomMåBegrunnes;
};

export const mapFaktaOgSvarTilRequest = (
    målgruppeForm: EndreMålgruppeGenerellForm
): MålgruppeGenerellFaktaOgSvar => ({
    '@type': 'MÅLGRUPPE',
    svarMedlemskap: målgruppeForm.vurderinger.svarMedlemskap,
    svarUtgifterDekketAvAnnetRegelverk:
        målgruppeForm.vurderinger.svarUtgifterDekketAvAnnetRegelverk,
});
