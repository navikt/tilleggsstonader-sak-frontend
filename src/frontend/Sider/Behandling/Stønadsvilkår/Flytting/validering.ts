import { TypeVilkårFaktaFlytting } from './typer/faktaFlytting';
import { RegelIdFlytting, RegelstrukturFlytting } from './typer/regelstrukturFlytting';
import { SvarOgBegrunnelseFlytting } from './typer/vilkårFlytting';
import { NødvendigUtgift } from '../../../../typer/nødvendigUtgift';
import { BegrunnelseRegel } from '../../../../typer/regel';
import { erGyldigDato } from '../../../../utils/dato';

export interface FeilmeldingerFlytting {
    flyttedato?: string;
    adresse?: string;
    begrunnelse?: Partial<Record<RegelIdFlytting, string>>;
    tilbud?: Array<{ navn?: string; pris?: string } | undefined>;
    nødvendigUtgift?: string;
    begrunnelseNødvendigUtgift?: string;
    erBetalingDokumentert?: string;
}

interface FaktaFlyttingSkjema {
    type: TypeVilkårFaktaFlytting;
    tilbud?: { navn: string; pris: string }[];
    nødvendigUtgift?: NødvendigUtgift;
    erBetalingDokumentert?: boolean;
}

export function validerFlytting(
    adresse: string,
    flyttedato: string,
    svar: Partial<Record<RegelIdFlytting, SvarOgBegrunnelseFlytting>>,
    aktiveRegler: RegelIdFlytting[],
    regelstruktur: RegelstrukturFlytting,
    fakta: FaktaFlyttingSkjema
): FeilmeldingerFlytting {
    const feilmeldinger: FeilmeldingerFlytting = {};

    if (!erGyldigDato(flyttedato)) {
        feilmeldinger.flyttedato = 'Fyll ut en gyldig flyttedato';
    }

    if (!adresse.trim()) {
        feilmeldinger.adresse = 'Fyll ut en gyldig adresse';
    }

    const begrunnelseFeil: Partial<Record<RegelIdFlytting, string>> = {};
    aktiveRegler.forEach((regelId) => {
        const vurdering = svar[regelId];
        if (!vurdering?.svar) {
            return;
        }

        const svaralternativ = regelstruktur[regelId].svaralternativer.find(
            (alternativ) => alternativ.svarId === vurdering.svar
        );
        if (
            svaralternativ?.begrunnelseType === BegrunnelseRegel.PÅKREVD &&
            !vurdering.begrunnelse?.trim()
        ) {
            begrunnelseFeil[regelId] = 'Begrunnelse er obligatorisk for dette valget';
        }
    });
    if (Object.keys(begrunnelseFeil).length > 0) {
        feilmeldinger.begrunnelse = begrunnelseFeil;
    }

    if (fakta.type !== 'FLYTTING_UBESTEMT') {
        const nødvendigUtgift = fakta.nødvendigUtgift;
        if (!nødvendigUtgift) {
            feilmeldinger.nødvendigUtgift = 'Du må velge om hele utgiften er nødvendig';
        } else if (
            nødvendigUtgift.erUtgiftenNødvendig === 'NEI' &&
            !nødvendigUtgift.begrunnelse?.trim()
        ) {
            feilmeldinger.begrunnelseNødvendigUtgift =
                'Du må begrunne hvorfor utgiften ikke vurderes som nødvendig';
        }

        if (fakta.type === 'FLYTTING_FLYTTEBYRÅ') {
            if (fakta.erBetalingDokumentert === undefined) {
                feilmeldinger.erBetalingDokumentert =
                    'Du må si om betaling er dokumentert eller ikke';
            }

            const tilbudFeil = (fakta.tilbud ?? []).map((tilbud) => {
                const feil: { navn?: string; pris?: string } = {};
                if (!tilbud.navn.trim()) {
                    feil.navn = 'Du må fylle ut navnet på flyttebyrået';
                }
                if (!tilbud.pris.trim()) {
                    feil.pris = 'Du må fylle ut prisen på tilbudet';
                } else if (!Number.isFinite(Number(tilbud.pris)) || Number(tilbud.pris) <= 0) {
                    feil.pris = 'Prisen på tilbudet må være større enn 0';
                }
                return Object.keys(feil).length > 0 ? feil : undefined;
            });
            if (tilbudFeil.some(Boolean)) {
                feilmeldinger.tilbud = tilbudFeil;
            }
        }
    }

    return feilmeldinger;
}
