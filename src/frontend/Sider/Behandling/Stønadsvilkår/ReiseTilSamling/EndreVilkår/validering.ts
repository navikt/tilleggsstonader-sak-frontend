import { finnBegrunnelsestypeForSvar } from './utils';
import { BegrunnelseRegel } from '../../../../../typer/regel';
import { Periode } from '../../../../../utils/periode';
import { harVerdi } from '../../../../../utils/utils';
import {
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
    utgifterOffentligTransport: string;
};

export type FeilmeldingerFaktaPrivatBil = {
    reiseavstand: string;
};

export type FeilmeldingerReiseTilSamling = {
    fom?: string;
    tom?: string;
    adresse?: string;
    reiseId?: string;
    fakta?: FeilmeldingerFaktaOffentligTransport | FeilmeldingerFaktaPrivatBil;
    begrunnelse?: Partial<Record<RegelIdReiseTilSamling, string>>;
};

export function ingen(valideringsfeil: FeilmeldingerReiseTilSamling) {
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
    svar: SvarVilkårReiseTilSamling,
    fakta: FaktaReiseTilSamling | undefined,
    regelstruktur: RegelstrukturReiseTilSamling
): FeilmeldingerReiseTilSamling => {
    const adresseValidering = validerAdresse(adresse);
    const faktaValidering = validerFakta(fakta, svar);
    const svarValidering = validerSvar(svar, regelstruktur);

    return {
        ...adresseValidering,
        ...svarValidering,
        ...faktaValidering,
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
};

const validerFaktaPrivatBil = (
    fakta: FaktaPrivatBil | undefined
): Partial<FeilmeldingerFaktaPrivatBil> | undefined => {
    if (!fakta) return undefined;
    if (!fakta.reiseavstand) {
        return { reiseavstand: 'Reiseavstand må være større enn 0' };
    }
};

const validerFakta = (
    fakta: FaktaReiseTilSamling | undefined,
    svar: SvarVilkårReiseTilSamling
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
