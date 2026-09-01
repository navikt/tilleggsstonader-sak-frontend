import { finnBegrunnelsestypeForSvar } from './utils';
import { BegrunnelseRegel } from '../../../../../typer/regel';
import { Periode } from '../../../../../utils/periode';
import { harVerdi } from '../../../../../utils/utils';
import {
    FaktaOffentligTransport,
    FaktaPrivatBil,
    FaktaReiseOppstartAvslutningHjemreise,
} from '../typer/faktaReiseOppstartAvslutningHjemreise';
import {
    RegelIdReiseOppstartAvslutningHjemreise,
    RegelstrukturReiseOppstartAvslutningHjemreise,
} from '../typer/regelstrukturReiseOppstartAvslutningHjemreise';
import {
    SvarOgBegrunnelse,
    SvarVilkårReiseOppstartAvslutningHjemreise,
    TypeReiseformål,
} from '../typer/vilkårReiseOppstartAvslutningHjemreise';

export type FeilmeldingerFaktaOffentligTransport = {
    utgifterOffentligTransport?: string;
    aktivitet?: string;
};

export type FeilmeldingerFaktaPrivatBil = {
    reiseavstand?: string;
    aktivitet?: string;
};

export type FeilmeldingerReiseOppstartAvslutningHjemreise = {
    fom?: string;
    tom?: string;
    adresse?: string;
    reiseId?: string;
    typeReiseformål?: string;
    fakta?: FeilmeldingerFaktaOffentligTransport | FeilmeldingerFaktaPrivatBil;
    begrunnelse?: Partial<Record<RegelIdReiseOppstartAvslutningHjemreise, string>>;
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
    periode: Periode,
    adresse: string | undefined,
    typeReiseformål: TypeReiseformål | undefined,
    svar: SvarVilkårReiseOppstartAvslutningHjemreise,
    fakta: FaktaReiseOppstartAvslutningHjemreise | undefined,
    regelstruktur: RegelstrukturReiseOppstartAvslutningHjemreise
): FeilmeldingerReiseOppstartAvslutningHjemreise => {
    const adresseValidering = validerAdresse(adresse);
    const typeReiseformålValidering = validerTypeReiseformål(typeReiseformål);
    const faktaValidering = validerFakta(fakta, svar);
    const svarValidering = validerSvar(svar, regelstruktur);

    return {
        ...adresseValidering,
        ...typeReiseformålValidering,
        ...svarValidering,
        ...(faktaValidering ? { fakta: faktaValidering } : {}),
    };
};

const validerAdresse = (
    adresse: string | undefined
): Partial<FeilmeldingerReiseOppstartAvslutningHjemreise> => {
    if (!adresse) {
        return { adresse: 'Adresse er påkrevd' };
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
    regelstruktur: RegelstrukturReiseOppstartAvslutningHjemreise
): Partial<FeilmeldingerReiseOppstartAvslutningHjemreise> | undefined => {
    if (!svarMap) {
        return;
    }

    const begrunnelseFeil: Partial<Record<RegelIdReiseOppstartAvslutningHjemreise, string>> = {};

    for (const [regelId, svar] of Object.entries(svarMap)) {
        if (
            !validerBegrunnelseForRegel(
                regelId as RegelIdReiseOppstartAvslutningHjemreise,
                svar,
                regelstruktur
            )
        ) {
            begrunnelseFeil[regelId as RegelIdReiseOppstartAvslutningHjemreise] =
                'Mangler begrunnelse';
        }
    }

    const finnesFeil = Object.keys(begrunnelseFeil).length > 0;

    return finnesFeil ? { begrunnelse: begrunnelseFeil } : undefined;
};

const validerFaktaOffentligTransport = (
    fakta: FaktaOffentligTransport | undefined
): Partial<FeilmeldingerFaktaOffentligTransport> | undefined => {
    if (!fakta?.utgifterOffentligTransport) {
        return { utgifterOffentligTransport: 'Mangler utgifter for offentlig transport' };
    }
    if (fakta?.utgifterOffentligTransport && fakta?.utgifterOffentligTransport < 0) {
        return {
            utgifterOffentligTransport: 'Utgifter for offentlig transport må være større enn 0',
        };
    }
    if (!fakta.aktivitetId) {
        return { aktivitet: 'Mangler aktivitet' };
    }
};

const validerFaktaPrivatBil = (
    fakta: FaktaPrivatBil | undefined
): Partial<FeilmeldingerFaktaPrivatBil> | undefined => {
    if (!fakta) return undefined;
    if (!fakta.reiseavstand) {
        return { reiseavstand: 'Reiseavstand må være større enn 0' };
    }
    if (!fakta.aktivitetId) {
        return { aktivitet: 'Mangler aktivitet' };
    }
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
        svar.KAN_REISE_MED_OFFENTLIG_TRANSPORT?.svar === 'JA'
    ) {
        return validerFaktaOffentligTransport(fakta as FaktaOffentligTransport);
    } else if (fakta?.type === 'PRIVAT_BIL' || svar.KAN_REISE_MED_EGEN_BIL?.svar === 'JA') {
        return validerFaktaPrivatBil(fakta as FaktaPrivatBil);
    }
};

function validerBegrunnelseForRegel(
    regelId: RegelIdReiseOppstartAvslutningHjemreise,
    svar: SvarOgBegrunnelse | undefined,
    regelstruktur: RegelstrukturReiseOppstartAvslutningHjemreise
): boolean {
    const svaralternativerForRegel = regelstruktur[regelId].svaralternativer;
    const begrunnelsesType = finnBegrunnelsestypeForSvar(svaralternativerForRegel, svar?.svar);

    const begrunnelseErObligatoriskOgUtfylt =
        begrunnelsesType === BegrunnelseRegel.PÅKREVD && harVerdi(svar?.begrunnelse);

    const regelKreverIkkeBegrunnelse = begrunnelsesType !== BegrunnelseRegel.PÅKREVD;

    return begrunnelseErObligatoriskOgUtfylt || regelKreverIkkeBegrunnelse;
}
