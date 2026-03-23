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

export interface FeilmeldingerFaktaPrivatBil extends FeilmeldingerFaktaDagligReise {
    fom?: string;
    tom?: string;
    reiseavstandEnVei?: string;
    reisedagerPerUke?: string;
    bompengerEnVei?: string;
    fergeEnVei?: string;
}

export type FeilmeldingerDagligReise = {
    fom?: string;
    tom?: string;
    adresse?: string;
    fakta?: FeilmeldingerFaktaDagligReise;
    begrunnelse?: Partial<Record<RegelIdDagligReise, string>>;
};

export function ingen(valideringsfeil: FeilmeldingerDagligReise) {
    return Object.keys(valideringsfeil).length === 0;
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

const validerFakta = (
    fakta: FaktaDagligReise | undefined,
    svar: SvarVilkårDagligReise
): FeilmeldingerFaktaDagligReise | undefined => {
    if (
        fakta?.type === 'OFFENTLIG_TRANSPORT' ||
        svar.KAN_REISE_MED_OFFENTLIG_TRANSPORT?.svar === 'JA'
    ) {
        return validerFaktaOffentligTransport(fakta as FaktaOffentligTransport);
    } else if (fakta?.type === 'PRIVAT_BIL' || svar.KAN_KJØRE_MED_EGEN_BIL?.svar === 'JA') {
        return validerFaktaPrivatBil(fakta as FaktaPrivatBil);
    }
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

    if (!fakta.prisEnkelbillett && !fakta.prisSyvdagersbillett && !fakta.prisTrettidagersbillett) {
        return {
            felles: 'Minst én billettpris må legges inn',
        };
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
): Partial<FeilmeldingerFaktaPrivatBil> | undefined => {
    if (!fakta) {
        return { felles: 'Mangler minst én reiseperiode og reiseavstand en vei' };
    }

    if (!fakta.reiseavstandEnVei) {
        return { reiseavstandEnVei: 'Mangler reiseavstand en vei' };
    }

    if (fakta.reiseperioder.length <= 0) {
        return { felles: 'Mangler minst én reiseperiode' };
    }

    if (fakta.reiseperioder.some((periode) => !periode.fom)) {
        return { fom: 'mangler fom dato' };
    }
    if (fakta.reiseperioder.some((periode) => !periode.tom)) {
        return { tom: 'mangler tom dato' };
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
