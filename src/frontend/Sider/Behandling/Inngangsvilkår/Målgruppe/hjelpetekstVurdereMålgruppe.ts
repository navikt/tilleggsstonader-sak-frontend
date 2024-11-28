import { MålgruppeType } from '../typer/vilkårperiode/målgruppe';

const nedsattArbeidsevne =
    'Se rundskriv til folketrygdloven kapittel 2. ' +
    'Du må først vurdere om søker er medlem i et annet lands trygdeordning (lovvalg). ' +
    'Dersom søker ikke er medlem i et annet land, ' +
    'må du vurder om vilkårene i folketrygdloven kapittel 2 er oppfylt.';

const uføretrygd =
    'Uføretrygd kan gis til personer som ikke er medlem i folketrygden. ' +
    'Dersom uføretrygden er gitt etter unntaksreglene i § 12-3 andre ledd, ' +
    'kan tilleggsstønader ikke gis fordi medlemskapsvilkåret ikke er oppfylt. ' +
    'Du må derfor innhente medlemskapsstatus fra Nav Arbeid og ytelser.';

const gjenlevende =
    'Gjenlevendeytelser kan gis til personer som ikke er medlem i folketrygden. ' +
    'Dersom gjenlevendepensjon/omstillingsstønad er gitt etter unntaksreglene i § 17-3 andre ledd, ' +
    'kan tilleggsstønader ikke gis fordi medlemskapsvilkåret ikke er oppfylt. ' +
    'Du må derfor innhente medlemskapsstatus fra Nav Familie og pensjonsytelser.';

export const målgruppeTilMedlemskapHjelpetekst = (type: MålgruppeType) => {
    switch (type) {
        case MålgruppeType.NEDSATT_ARBEIDSEVNE:
            return nedsattArbeidsevne;
        case MålgruppeType.UFØRETRYGD:
            return uføretrygd;
        case MålgruppeType.OMSTILLINGSSTØNAD:
            return gjenlevende;
        default:
            return undefined;
    }
};
