import { finnBegrunnelsestypeForSvar, initierAktiveDelvilkår } from './utils';
import { erSvarJaNei } from '../../../../../typer/nødvendigUtgift';
import { BegrunnelseRegel } from '../../../../../typer/regel';
import { Periode, validerPeriode } from '../../../../../utils/periode';
import { harIkkeVerdi, harVerdi } from '../../../../../utils/utils';
import {
    FaktaOffentligTransport,
    FaktaPrivatBil,
    FaktaReiseOppstartAvslutningHjemreise,
} from '../typer/faktaReiseOppstartAvslutningHjemreise';
import { RegelIdROAH, Regelstruktur } from '../typer/regelstrukturReiseOppstartAvslutningHjemreise';
import {
    SvarOgBegrunnelse,
    SvarVilkårReiseOppstartAvslutningHjemreise,
    TypeReiseformål,
} from '../typer/vilkårReiseOppstartAvslutningHjemreise';

export type FeilmeldingerFaktaOffentligTransport = {
    utgifterOffentligTransport?: string;
    aktivitet?: string;
    spesifikasjonAvUtgift?: string;
    nødvendigUtgift?: string;
    begrunnelseNødvendigUtgift?: string;
};

export type FeilmeldingerFaktaPrivatBil = {
    reiseavstand?: string;
    aktivitet?: string;
    bompenger?: string;
    fergekostnad?: string;
    parkering?: string;
    piggdekkavgift?: string;
    spesifikasjonAvUtgift?: string;
    nødvendigUtgift?: string;
    begrunnelseNødvendigUtgift?: string;
};

type FeilmeldingerNødvendigUtgift = Pick<
    FeilmeldingerFaktaOffentligTransport,
    'nødvendigUtgift' | 'begrunnelseNødvendigUtgift'
>;

export type FeilmeldingerReiseOppstartAvslutningHjemreise = {
    fom?: string;
    tom?: string;
    reiseId?: string;
    typeReiseformål?: string;
    fakta?: FeilmeldingerFaktaOffentligTransport | FeilmeldingerFaktaPrivatBil;
    begrunnelse?: Partial<Record<RegelIdROAH, string>>;
};

export function harValideringsFeil(valideringsfeil: FeilmeldingerReiseOppstartAvslutningHjemreise) {
    const { fakta, ...resten } = valideringsfeil;
    const harAndreFeil = Object.keys(resten).length > 0;
    if (harAndreFeil) return true;
    if (Array.isArray(fakta)) {
        return fakta.some((obj) => Object.keys(obj).length > 0);
    }
    if (typeof fakta === 'object' && fakta !== null) {
        return Object.keys(fakta).length > 0;
    }
    return false;
}

export const validerVilkår = (
    typeReiseformål: TypeReiseformål | undefined,
    periode: Periode,
    svar: SvarVilkårReiseOppstartAvslutningHjemreise,
    fakta: FaktaReiseOppstartAvslutningHjemreise | undefined,
    regelstruktur: Regelstruktur | undefined
): FeilmeldingerReiseOppstartAvslutningHjemreise => {
    const typeReiseformålValidering = validerTypeReiseformål(typeReiseformål);
    const faktaValidering = validerFakta(fakta, svar);
    const svarValidering = validerSvar(svar, regelstruktur);
    const datoerValidering = validerDatoer(periode, typeReiseformål);

    return {
        ...typeReiseformålValidering,
        ...svarValidering,
        ...(faktaValidering ? { fakta: faktaValidering } : {}),
        ...datoerValidering,
    };
};

const validerDatoer = (
    periode: Periode,
    typeReiseformål?: TypeReiseformål
): Partial<FeilmeldingerReiseOppstartAvslutningHjemreise> => {
    if (typeReiseformål === 'HJEMREISE') {
        return { ...validerPeriode(periode) };
    } else if (harIkkeVerdi(periode.fom)) {
        return { fom: 'Dato må fylles ut' };
    }
    return {};
};

const validerTypeReiseformål = (
    typeReiseformål: TypeReiseformål | undefined
): Partial<FeilmeldingerReiseOppstartAvslutningHjemreise> => {
    if (!typeReiseformål) {
        return {
            typeReiseformål: 'Du må velge om reisen gjelder oppstart, avslutning eller hjemreise',
        };
    }
    return {};
};

const validerSvar = (
    svarMap: SvarVilkårReiseOppstartAvslutningHjemreise | undefined,
    regelstruktur: Regelstruktur | undefined
): Partial<FeilmeldingerReiseOppstartAvslutningHjemreise> | undefined => {
    if (!svarMap || !regelstruktur) {
        return;
    }

    const begrunnelseFeil: Partial<Record<RegelIdROAH, string>> = {};

    const aktiveRegler = initierAktiveDelvilkår(svarMap, regelstruktur);

    for (const [regelId, svar] of Object.entries(svarMap)) {
        const erAktiv = aktiveRegler.get(regelId as RegelIdROAH);
        if (!erAktiv || !svar) {
            continue;
        }

        if (!validerBegrunnelseForRegel(regelId as RegelIdROAH, svar, regelstruktur)) {
            begrunnelseFeil[regelId as RegelIdROAH] = 'Mangler begrunnelse';
        }
    }

    const finnesFeil = Object.keys(begrunnelseFeil).length > 0;

    return finnesFeil ? { begrunnelse: begrunnelseFeil } : undefined;
};

const validerFaktaOffentligTransport = (
    fakta: FaktaOffentligTransport | undefined
): Partial<FeilmeldingerFaktaOffentligTransport> | undefined => {
    if (!fakta) return undefined;

    const feil: Partial<FeilmeldingerFaktaOffentligTransport> = {};

    if (!fakta?.utgifterOffentligTransport) {
        feil.utgifterOffentligTransport = 'Mangler utgifter for offentlig transport';
    }
    if (fakta?.utgifterOffentligTransport && fakta?.utgifterOffentligTransport < 0) {
        feil.utgifterOffentligTransport = 'Utgifter for offentlig transport må være større enn 0';
    }

    if (!harVerdi(fakta.begrunnelse)) {
        feil.spesifikasjonAvUtgift = 'Mangler spesifikasjon av utgift';
    }

    Object.assign(feil, validerNødvendigUtgift(fakta.nødvendigUtgift));

    return Object.keys(feil).length > 0 ? feil : undefined;
};

const validerNødvendigUtgift = (
    nødvendigUtgift: FaktaOffentligTransport['nødvendigUtgift'] | FaktaPrivatBil['nødvendigUtgift']
): FeilmeldingerNødvendigUtgift => {
    const feil: FeilmeldingerNødvendigUtgift = {};

    if (!nødvendigUtgift || !erSvarJaNei(nødvendigUtgift.erUtgiftenNødvendig)) {
        feil.nødvendigUtgift = 'Du må velge om utgiften er nødvendig';
        return feil;
    }

    if (nødvendigUtgift.erUtgiftenNødvendig === 'NEI' && !harVerdi(nødvendigUtgift.begrunnelse)) {
        feil.begrunnelseNødvendigUtgift =
            'Du må begrunne hvorfor utgiften ikke vurderes som nødvendig';
    }

    return feil;
};

const validerFaktaPrivatBil = (
    fakta: FaktaPrivatBil | undefined
): Partial<FeilmeldingerFaktaPrivatBil> | undefined => {
    if (!fakta) return undefined;
    const feil: Partial<FeilmeldingerFaktaPrivatBil> = {};

    if (!fakta.reiseavstand) {
        feil.reiseavstand = 'Reiseavstand må være større enn 0';
    }
    if (fakta.bompenger !== undefined && fakta.bompenger < 0) {
        feil.bompenger = 'Bompenger må være større enn 0';
    }
    if (fakta.fergekostnad !== undefined && fakta.fergekostnad < 0) {
        feil.fergekostnad = 'Fergekostnad må være større enn 0';
    }
    if (fakta.parkering !== undefined && fakta.parkering < 0) {
        feil.parkering = 'Parkering må være større enn 0';
    }
    if (fakta.piggdekkavgift !== undefined && fakta.piggdekkavgift < 0) {
        feil.piggdekkavgift = 'Piggdekkavgift må være større enn 0';
    }

    Object.assign(feil, validerNødvendigUtgift(fakta.nødvendigUtgift));

    return Object.keys(feil).length > 0 ? feil : undefined;
};

const validerFakta = (
    fakta: FaktaReiseOppstartAvslutningHjemreise | undefined,
    svar: SvarVilkårReiseOppstartAvslutningHjemreise
):
    | Partial<FeilmeldingerFaktaOffentligTransport>
    | Partial<FeilmeldingerFaktaPrivatBil>
    | undefined => {
    if (
        fakta?.type === 'OFFENTLIG_TRANSPORT' ||
        svar.ROAH_KAN_REISE_MED_OFFENTLIG_TRANSPORT?.svar === 'JA'
    ) {
        return validerFaktaOffentligTransport(fakta as FaktaOffentligTransport);
    } else if (fakta?.type === 'PRIVAT_BIL' || svar.ROAH_KAN_BENYTTE_PRIVAT_BIL?.svar === 'JA') {
        return validerFaktaPrivatBil(fakta as FaktaPrivatBil);
    }
};

function validerBegrunnelseForRegel(
    regelId: RegelIdROAH,
    svar: SvarOgBegrunnelse | undefined,
    regelstruktur: Regelstruktur
): boolean {
    const svaralternativerForRegel = regelstruktur[regelId]?.svaralternativer ?? [];
    const begrunnelsesType = finnBegrunnelsestypeForSvar(svaralternativerForRegel, svar?.svar);

    const begrunnelseErObligatoriskOgUtfylt =
        begrunnelsesType === BegrunnelseRegel.PÅKREVD && harVerdi(svar?.begrunnelse);

    const regelKreverIkkeBegrunnelse = begrunnelsesType !== BegrunnelseRegel.PÅKREVD;

    return begrunnelseErObligatoriskOgUtfylt || regelKreverIkkeBegrunnelse;
}
