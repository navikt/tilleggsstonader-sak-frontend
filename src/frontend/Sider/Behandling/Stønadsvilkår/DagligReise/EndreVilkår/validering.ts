import { finnBegrunnelsestypeForSvar } from './utils';
import { BegrunnelseRegel } from '../../../../../typer/regel';
import { Periode, validerPeriode } from '../../../../../utils/periode';
import { harVerdi } from '../../../../../utils/utils';
import {
    FaktaDagligReise,
    FaktaOffentligTransport,
    FaktaPrivatBil,
} from '../typer/faktaDagligReise';
import { RegelIdDagligReise, Regelstruktur } from '../typer/regelstrukturDagligReise';
import { SvarOgBegrunnelse, SvarVilkårDagligReise } from '../typer/vilkårDagligReise';

export interface FeilmeldingerFaktaDagligReise {
    felles?: string;
}

export interface FeilmeldingerFaktaOffentligTransport extends FeilmeldingerFaktaDagligReise {
    reisedagerPerUke?: string;
    enkeltbillett?: string;
    syvdagersbillett?: string;
    trettidagersbillett?: string;
}

export type FeilmeldingerFaktaPrivatBil = Array<{
    fom?: string;
    tom?: string;
    reisedagerPerUke?: string;
    bompengerPerDag?: string;
    fergePerDag?: string;
    reiseavstandEnVei?: string;
    aktivitet?: string;
}>;

export type FeilmeldingerDagligReise = {
    fom?: string;
    tom?: string;
    adresse?: string;
    fakta?: FeilmeldingerFaktaDagligReise | FeilmeldingerFaktaPrivatBil;
    begrunnelse?: Partial<Record<RegelIdDagligReise, string>>;
};

export function ingen(valideringsfeil: FeilmeldingerDagligReise) {
    const { fakta, ...resten } = valideringsfeil;
    const harAndreFeil = Object.keys(resten).length > 0;
    if (harAndreFeil) return false;
    if (Array.isArray(fakta)) {
        return fakta.every((obj) => Object.keys(obj).length === 0);
    }
    if (typeof fakta === 'object' && fakta !== null) {
        return Object.keys(fakta).length === 0;
    }
    return true;
}

export const validerVilkår = (
    periode: Periode,
    adresse: string | undefined,
    svar: SvarVilkårDagligReise,
    fakta: FaktaDagligReise | undefined,
    regelstruktur: Regelstruktur
): FeilmeldingerDagligReise => {
    const periodeValidering = validerPeriode(periode);
    const adresseValidering = validerAdresse(adresse);
    const faktaValidering = validerFakta(fakta, svar);
    const svarValidering = validerSvar(svar, regelstruktur);

    return {
        ...periodeValidering,
        ...adresseValidering,
        ...svarValidering,
        ...(faktaValidering && { fakta: faktaValidering }),
    };
};

const validerAdresse = (adresse: string | undefined): Partial<FeilmeldingerDagligReise> => {
    if (!adresse) {
        return { adresse: 'Adresse er påkrevd' };
    }
    return {};
};

const validerSvar = (
    svarMap: SvarVilkårDagligReise | undefined,
    regelstruktur: Regelstruktur
): Partial<FeilmeldingerDagligReise> | undefined => {
    if (!svarMap) {
        return;
    }

    const begrunnelseFeil: Partial<Record<RegelIdDagligReise, string>> = {};

    for (const [regelId, svar] of Object.entries(svarMap)) {
        if (!validerBegrunnelseForRegel(regelId as RegelIdDagligReise, svar, regelstruktur)) {
            begrunnelseFeil[regelId as RegelIdDagligReise] = 'Mangler begrunnelse';
        }
    }

    const finnesFeil = Object.keys(begrunnelseFeil).length > 0;

    return finnesFeil ? { begrunnelse: begrunnelseFeil } : undefined;
};

const validerFaktaOffentligTransport = (
    fakta: FaktaOffentligTransport | undefined
): Partial<FeilmeldingerFaktaOffentligTransport> | undefined => {
    if (!fakta) {
        return { felles: 'Mangler reisedager per uke og minst én billettpris' };
    }

    if (!fakta.reisedagerPerUke) {
        return { reisedagerPerUke: 'Mangler reisdager per uke' };
    }

    if (fakta.reisedagerPerUke < 0 || fakta.reisedagerPerUke > 5) {
        return { reisedagerPerUke: 'Reisdager per uke må være mellom 0 og 5' };
    }

    if (fakta.prisEnkelbillett && fakta.prisEnkelbillett < 0) {
        return { enkeltbillett: 'Prisen må være større enn 0' };
    }
    if (fakta.prisSyvdagersbillett && fakta.prisSyvdagersbillett < 0) {
        return { syvdagersbillett: 'Prisen må være større enn 0' };
    }
    if (fakta.prisTrettidagersbillett && fakta.prisTrettidagersbillett < 0) {
        return { trettidagersbillett: 'Prisen må være større enn 0' };
    }
};

const validerFaktaPrivatBil = (
    fakta: FaktaPrivatBil | undefined
): FeilmeldingerFaktaPrivatBil | undefined => {
    if (!fakta) return undefined;
    const feilListe = fakta.faktaDelperioder.map((periode) => {
        const feil: {
            fom?: string;
            tom?: string;
            reisedagerPerUke?: string;
            bompengerPerDag?: string;
            fergePerDag?: string;
            reiseavstandEnVei?: string;
            aktivitet?: string;
        } = {};
        if (!periode.fom || periode.fom === '') feil.fom = 'Fra-dato må fylles ut';
        if (!periode.tom || periode.tom === '') feil.tom = 'Til-dato må fylles ut';
        if (
            !periode.reisedagerPerUke ||
            periode.reisedagerPerUke > 7 ||
            periode.reisedagerPerUke < 1
        )
            feil.reisedagerPerUke = 'Reisedager må være mellom 1 og 7';
        if (periode.bompengerPerDag && periode.bompengerPerDag < 0)
            feil.bompengerPerDag = 'Bompenger må være større enn 0';
        if (periode.fergekostnadPerDag && periode.fergekostnadPerDag < 0)
            feil.fergePerDag = 'Fergekostnad må være større enn 0';
        return feil;
    });
    // Valider felles reiseavstandEnVei og legg på første element
    if (fakta.reiseavstandEnVei === undefined || Number(fakta.reiseavstandEnVei) <= 0) {
        if (feilListe.length > 0) {
            feilListe[0] = {
                ...feilListe[0],
                reiseavstandEnVei: 'Reiseavstand per dag må fylles ut og være større enn 0',
            };
        } else {
            feilListe.push({
                reiseavstandEnVei: 'Reiseavstand per dag må fylles ut og være større enn 0',
            });
        }
    }
    if (!fakta.aktivitetId) {
        if (feilListe.length > 0) {
            feilListe[0] = {
                ...feilListe[0],
                aktivitet: 'Du må velge en aktivitet',
            };
        } else {
            feilListe.push({
                aktivitet: 'Du må velge en aktivitet',
            });
        }
    }
    return feilListe;
};

const validerFakta = (
    fakta: FaktaDagligReise | undefined,
    svar: SvarVilkårDagligReise
): FeilmeldingerFaktaDagligReise | FeilmeldingerFaktaPrivatBil | undefined => {
    if (
        fakta?.type === 'OFFENTLIG_TRANSPORT' ||
        svar.KAN_REISE_MED_OFFENTLIG_TRANSPORT?.svar === 'JA'
    ) {
        return validerFaktaOffentligTransport(fakta as FaktaOffentligTransport);
    } else if (fakta?.type === 'PRIVAT_BIL' || svar.KAN_KJØRE_MED_EGEN_BIL?.svar === 'JA') {
        return validerFaktaPrivatBil(fakta as FaktaPrivatBil);
    }
};

function validerBegrunnelseForRegel(
    regelId: RegelIdDagligReise,
    svar: SvarOgBegrunnelse | undefined,
    regelstruktur: Regelstruktur
): boolean {
    const svaralternativerForRegel = regelstruktur[regelId].svaralternativer;
    const begrunnelsesType = finnBegrunnelsestypeForSvar(svaralternativerForRegel, svar?.svar);

    const begrunnelseErObligatoriskOgUtfylt =
        begrunnelsesType === BegrunnelseRegel.PÅKREVD && harVerdi(svar?.begrunnelse);

    const regelKreverIkkeBegrunnelse = begrunnelsesType !== BegrunnelseRegel.PÅKREVD;

    return begrunnelseErObligatoriskOgUtfylt || regelKreverIkkeBegrunnelse;
}
