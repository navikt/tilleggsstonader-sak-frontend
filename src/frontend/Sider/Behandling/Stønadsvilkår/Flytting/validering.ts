import { ekstrakostnaderFlytting, TypeVilkårFaktaFlytting } from './typer/faktaFlytting';
import { RegelIdFlytting, RegelstrukturFlytting } from './typer/regelstrukturFlytting';
import { SvarOgBegrunnelseFlytting } from './typer/vilkårFlytting';
import { tilEkstrakostnad } from './utils';
import { NødvendigUtgift } from '../../../../typer/nødvendigUtgift';
import { BegrunnelseRegel } from '../../../../typer/regel';
import { erGyldigDato } from '../../../../utils/dato';

type Ekstrakostnad = (typeof ekstrakostnaderFlytting)[number]['felt'];

export interface FeilmeldingerFlytting {
    flyttedato?: string;
    adresse?: string;
    begrunnelse?: Partial<Record<RegelIdFlytting, string>>;
    tilbud?: Array<{ navn?: string; pris?: string } | undefined>;
    nødvendigUtgift?: string;
    begrunnelseNødvendigUtgift?: string;
    beløpSomKanDekkes?: string;
    erUtgifterDokumentert?: string;
    begrunnelseDokumenterteUtgifter?: string;
    ekstrakostnader?: Partial<Record<Ekstrakostnad, string>>;
}

interface FaktaFlyttingSkjema extends Partial<Record<Ekstrakostnad, string>> {
    type: TypeVilkårFaktaFlytting;
    tilbud?: { navn: string; pris: string }[];
    nødvendigUtgift?: NødvendigUtgift;
    beløpSomKanDekkes?: string;
    erUtgifterDokumentert?: string;
    begrunnelseDokumenterteUtgifter?: string;
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

        if (fakta.erUtgifterDokumentert === undefined) {
            feilmeldinger.erUtgifterDokumentert = 'Du må si om betaling er dokumentert eller ikke';
        }
        if (
            fakta.erUtgifterDokumentert === 'JA' &&
            !fakta.begrunnelseDokumenterteUtgifter?.trim()
        ) {
            feilmeldinger.begrunnelseDokumenterteUtgifter =
                'Du må begrunne hvorfor utgiften er dokumentert og skal utbetales';
        }

        if (fakta.type === 'FLYTTING_FLYTTE_SELV') {
            const kostnadsfeil: Partial<Record<Ekstrakostnad, string>> = {};
            ekstrakostnaderFlytting.forEach(({ felt }) => {
                const beløp = tilEkstrakostnad(fakta[felt] ?? '');
                if (beløp === null) {
                    return;
                }
                if (!Number.isFinite(beløp)) {
                    kostnadsfeil[felt] = 'Fyll ut et gyldig beløp';
                } else if (beløp < 0) {
                    kostnadsfeil[felt] = 'Kostnaden kan ikke være negativ';
                }
            });
            if (Object.keys(kostnadsfeil).length > 0) {
                feilmeldinger.ekstrakostnader = kostnadsfeil;
            }
        }

        if (fakta.type === 'FLYTTING_FLYTTEBYRÅ') {
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

            if (nødvendigUtgift?.erUtgiftenNødvendig === 'NEI') {
                const beløp = fakta.beløpSomKanDekkes?.trim() ?? '';
                if (!beløp) {
                    feilmeldinger.beløpSomKanDekkes = 'Du må fylle ut beløpet som kan dekkes';
                } else if (!Number.isFinite(Number(beløp)) || Number(beløp) <= 0) {
                    feilmeldinger.beløpSomKanDekkes = 'Beløpet som kan dekkes må være større enn 0';
                }
            }
        }
    }

    return feilmeldinger;
}
