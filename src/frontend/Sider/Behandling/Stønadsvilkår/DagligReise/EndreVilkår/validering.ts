import { finnBegrunnelsestypeForSvar } from './utils';
import { BegrunnelseRegel } from '../../../../../typer/regel';
import { Periode, validerPeriode } from '../../../../../utils/periode';
import { FaktaDagligReise, FaktaOffentligTransport } from '../typer/faktaDagligReise';
import { RegelIdDagligReise, Regelstruktur } from '../typer/regelstrukturDagligReise';
import { SvarVilkårDagligReise } from '../typer/vilkårDagligReise';

export type FeilmeldingerFaktaDagligReise = {
    reisedagerPerUke?: string;
    enkeltbillett?: string;
    syvdagersbillett?: string;
    trettidagersbillett?: string;
};

export type FeilmeldingerDagligReise = {
    fom?: string;
    tom?: string;
    fakta?: FeilmeldingerFaktaDagligReise;
    begrunnelse?: string;
};

export function ingen(valideringsfeil: FeilmeldingerDagligReise) {
    return Object.keys(valideringsfeil).length === 0;
}

export const validerVilkår = (
    periode: Periode,
    svar: SvarVilkårDagligReise | undefined,
    fakta: FaktaDagligReise | undefined,
    regelstruktur: Regelstruktur
): FeilmeldingerDagligReise => {
    const periodeValidering = validerPeriode(periode);
    const faktaValidering = validerFakta(fakta);
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

    const svarMedManglendeBegrunnelse = Object.entries(svarMap).find(([regelId, svar]) => {
        const svarAlternativer = regelstruktur[regelId as RegelIdDagligReise].svaralternativer;
        const begrunnelsesType = finnBegrunnelsestypeForSvar(svarAlternativer, svar?.svar);

        return begrunnelsesType === BegrunnelseRegel.PÅKREVD && !svar?.begrunnelse;
    });

    if (svarMedManglendeBegrunnelse) {
        return { begrunnelse: 'Mangler begrunnelse' };
    }
};

const validerFakta = (fakta: FaktaDagligReise | undefined) => {
    if (!fakta) {
        return;
    }

    if (fakta.type === 'OFFENTLIG_TRANSPORT') {
        return validerFaktaOffentligTransport(fakta as FaktaOffentligTransport);
    }
};

const validerFaktaOffentligTransport = (
    fakta: FaktaOffentligTransport
): Partial<FeilmeldingerFaktaDagligReise> | undefined => {
    if (!fakta.reisedagerPerUke) {
        return { reisedagerPerUke: 'Mangler reisdager per uke' };
    }
    if (fakta.reisedagerPerUke < 0) {
        return { reisedagerPerUke: 'Reisdager per uke må være mellom 0 og 7' };
    }
    if (fakta.reisedagerPerUke > 7) {
        return { reisedagerPerUke: 'Reisdager per uke må være mellom 0 og 7' };
    }

    if (!fakta.prisEnkelbillett && !fakta.prisSyvdagersbillett && !fakta.prisTrettidagersbillett) {
        return {
            enkeltbillett: 'Minst en billettpris må legges inn',
            syvdagersbillett: 'Minst en billettpris må legges inn',
            trettidagersbillett: 'Minst en billettpris må legges inn',
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

export const faktaOffentligTransportTilFeilmeldingFaktaDagligReiseMap: Record<
    keyof FaktaOffentligTransport,
    keyof FeilmeldingerFaktaDagligReise | undefined
> = {
    reisedagerPerUke: 'reisedagerPerUke',
    prisEnkelbillett: 'enkeltbillett',
    prisSyvdagersbillett: 'syvdagersbillett',
    prisTrettidagersbillett: 'trettidagersbillett',
    '@type': undefined,
    type: undefined,
};
