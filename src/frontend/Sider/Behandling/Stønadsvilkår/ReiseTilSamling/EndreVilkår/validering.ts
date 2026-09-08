import { finnBegrunnelsestypeForSvar } from './utils';
import { BegrunnelseRegel } from '../../../../../typer/regel';
import { Periode, validerPeriode } from '../../../../../utils/periode';
import { harVerdi } from '../../../../../utils/utils';
import {
    erFaktaOffentligTransport,
    erFaktaPrivatBil,
    FaktaOffentligTransport,
    FaktaPrivatBil,
    FaktaReiseTilSamling,
} from '../typer/faktaReiseTilSamling';
import {
    RegelIdReiseTilSamling,
    RegelstrukturReiseTilSamling,
} from '../typer/regelstrukturReiseTilSamling';
import { SvarOgBegrunnelse, SvarVilkårReiseTilSamling } from '../typer/vilkårReiseTilSamling';

export type FeilmeldingerFaktaOffentligTransport = {
    utgifterOffentligTransport?: string;
    aktivitet?: string;
    spesifikasjonAvUtgift?: string;
};

export type FeilmeldingerFaktaPrivatBil = {
    reiseavstand?: string;
    aktivitet?: string;
    bompenger?: string;
    fergekostnad?: string;
    parkering?: string;
    spesifikasjonAvUtgift?: string;
};

export type FeilmeldingerReiseTilSamling = {
    fom?: string;
    tom?: string;
    adresse?: string;
    reiseId?: string;
    fakta?: FeilmeldingerFaktaOffentligTransport | FeilmeldingerFaktaPrivatBil;
    begrunnelse?: Partial<Record<RegelIdReiseTilSamling, string>>;
};

export function harValideringsFeil(valideringsfeil: FeilmeldingerReiseTilSamling) {
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
    svar: SvarVilkårReiseTilSamling,
    fakta: FaktaReiseTilSamling,
    regelstruktur: RegelstrukturReiseTilSamling,
    gjelderTsr: boolean
): FeilmeldingerReiseTilSamling => {
    const periodeValidering = validerPeriode(periode);
    const adresseValidering = validerAdresse(adresse);
    const faktaValidering = validerFakta(fakta, gjelderTsr);
    const svarValidering = validerSvar(svar, regelstruktur);

    return {
        ...periodeValidering,
        ...adresseValidering,
        ...svarValidering,
        ...{ fakta: faktaValidering },
    };
};

const validerAdresse = (adresse: string | undefined): Partial<FeilmeldingerReiseTilSamling> => {
    if (!adresse) {
        return { adresse: 'Adresse er påkrevd' };
    }
    return {};
};

const validerSvar = (
    svarMap: SvarVilkårReiseTilSamling | undefined,
    regelstruktur: RegelstrukturReiseTilSamling
): Partial<FeilmeldingerReiseTilSamling> | undefined => {
    if (!svarMap) {
        return;
    }

    const begrunnelseFeil: Partial<Record<RegelIdReiseTilSamling, string>> = {};

    for (const [regelId, svar] of Object.entries(svarMap)) {
        if (!validerBegrunnelseForRegel(regelId as RegelIdReiseTilSamling, svar, regelstruktur)) {
            begrunnelseFeil[regelId as RegelIdReiseTilSamling] = 'Mangler begrunnelse';
        }
    }

    const finnesFeil = Object.keys(begrunnelseFeil).length > 0;

    return finnesFeil ? { begrunnelse: begrunnelseFeil } : undefined;
};

const validerFaktaOffentligTransport = (
    fakta: FaktaOffentligTransport,
    gjelderTsr: boolean
): FeilmeldingerFaktaOffentligTransport => {
    const feil: FeilmeldingerFaktaOffentligTransport = {};

    if (!fakta.utgifterOffentligTransport) {
        feil.utgifterOffentligTransport = 'Mangler utgifter for offentlig transport';
    }
    if (fakta.utgifterOffentligTransport && fakta.utgifterOffentligTransport < 0) {
        feil.utgifterOffentligTransport = 'Utgifter for offentlig transport må være større enn 0';
    }
    if (!harVerdi(fakta.begrunnelse)) {
        feil.spesifikasjonAvUtgift = 'Mangler spesifikasjon av utgift';
    }
    if (gjelderTsr && !fakta.aktivitetId) {
        feil.aktivitet = 'Du må velge en aktivitet';
    }

    return feil;
};

const validerFaktaPrivatBil = (
    fakta: FaktaPrivatBil,
    gjelderTsr: boolean
): FeilmeldingerFaktaPrivatBil => {
    const feil: FeilmeldingerFaktaPrivatBil = {};

    if (!fakta.reiseavstand || fakta.reiseavstand < 30) {
        feil.reiseavstand = 'Reiseavstand må være 30 km eller mer';
    }
    if (fakta.bompenger !== undefined && fakta.bompenger < 0) {
        feil.bompenger = 'Bompenger kan ikke være negativt';
    }
    if (fakta.fergekostnad !== undefined && fakta.fergekostnad < 0) {
        feil.fergekostnad = 'Fergekostnad kan ikke være negativ';
    }
    if (fakta.parkering !== undefined && fakta.parkering < 0) {
        feil.parkering = 'Parkering kan ikke være negativ';
    }
    if (!harVerdi(fakta.begrunnelse)) {
        feil.spesifikasjonAvUtgift = 'Mangler spesifikasjon av utgift';
    }
    if (gjelderTsr && !fakta.aktivitetId) {
        feil.aktivitet = 'Du må velge en aktivitet';
    }

    return feil;
};

const validerFakta = (
    fakta: FaktaReiseTilSamling,
    gjelderTsr: boolean
): FeilmeldingerFaktaOffentligTransport | FeilmeldingerFaktaPrivatBil => {
    if (erFaktaOffentligTransport(fakta)) {
        return validerFaktaOffentligTransport(fakta, gjelderTsr);
    }

    if (erFaktaPrivatBil(fakta)) {
        return validerFaktaPrivatBil(fakta, gjelderTsr);
    }

    return {};
};

function validerBegrunnelseForRegel(
    regelId: RegelIdReiseTilSamling,
    svar: SvarOgBegrunnelse | undefined,
    regelstruktur: RegelstrukturReiseTilSamling
): boolean {
    const svaralternativerForRegel = regelstruktur[regelId].svaralternativer;
    const begrunnelsesType = finnBegrunnelsestypeForSvar(svaralternativerForRegel, svar?.svar);

    const begrunnelseErObligatoriskOgUtfylt =
        begrunnelsesType === BegrunnelseRegel.PÅKREVD && harVerdi(svar?.begrunnelse);

    const regelKreverIkkeBegrunnelse = begrunnelsesType !== BegrunnelseRegel.PÅKREVD;

    return begrunnelseErObligatoriskOgUtfylt || regelKreverIkkeBegrunnelse;
}
