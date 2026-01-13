import { finnBegrunnelsestypeForSvar } from './utils';
import { BegrunnelseRegel } from '../../../../../typer/regel';
import { Periode, validerPeriode } from '../../../../../utils/periode';
import { FaktaDagligReise, FaktaOffentligTransport } from '../typer/faktaDagligReise';
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

export type FeilmeldingerDagligReise = {
    fom?: string;
    tom?: string;
    fakta?: FeilmeldingerFaktaDagligReise;
    begrunnelse?: Partial<Record<RegelIdDagligReise, string>>;
};

export function ingen(valideringsfeil: FeilmeldingerDagligReise) {
    return Object.keys(valideringsfeil).length === 0;
}

export const validerVilkår = (
    periode: Periode,
    svar: SvarVilkårDagligReise,
    fakta: FaktaDagligReise | undefined,
    regelstruktur: Regelstruktur
): FeilmeldingerDagligReise => {
    const periodeValidering = validerPeriode(periode);
    const faktaValidering = validerFakta(fakta, svar);
    const svarValidering = validerSvar(svar, regelstruktur);

    return {
        ...periodeValidering,
        ...svarValidering,
        ...(faktaValidering && { fakta: faktaValidering }),
    };
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
        if (!harBegrunnelseHvisObligatorisk(regelId as RegelIdDagligReise, svar, regelstruktur)) {
            begrunnelseFeil[regelId as RegelIdDagligReise] = 'Mangler begrunnelse';
        }
    }

    return { begrunnelse: begrunnelseFeil };
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

function harBegrunnelseHvisObligatorisk(
    regelId: RegelIdDagligReise,
    svar: SvarOgBegrunnelse | undefined,
    regelstruktur: Regelstruktur
): boolean {
    const svaralternativerForRegel = regelstruktur[regelId].svaralternativer;
    const begrunnelsesType = finnBegrunnelsestypeForSvar(svaralternativerForRegel, svar?.svar);

    return begrunnelsesType === BegrunnelseRegel.PÅKREVD && svar?.begrunnelse !== undefined;
}
