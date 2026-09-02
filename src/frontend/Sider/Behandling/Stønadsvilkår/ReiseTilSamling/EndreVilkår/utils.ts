import { BegrunnelseRegel, SvarId } from '../../../../../typer/regel';
import {
    FaktaOffentligTransport,
    FaktaPrivatBil,
    typeReiseTilSamlingTilTypeVilkårFakta,
} from '../typer/faktaReiseTilSamling';
import {
    RegelIdReiseTilSamling,
    RegelstrukturReiseTilSamling,
    SvarAlternativ,
    TypeVilkårFakta,
} from '../typer/regelstrukturReiseTilSamling';
import { SvarVilkårReiseTilSamling, VilkårReiseTilSamling } from '../typer/vilkårReiseTilSamling';

export const initierSvar = (
    eksisterendeVilkår: VilkårReiseTilSamling | undefined
): SvarVilkårReiseTilSamling => {
    if (!eksisterendeVilkår) {
        return tomtSvar;
    }

    const vurderinger = eksisterendeVilkår.delvilkårsett.flatMap(
        (delvilkår) => delvilkår.vurderinger
    );

    return vurderinger.reduce((acc, vurdering) => {
        acc[vurdering.regelId as RegelIdReiseTilSamling] = vurdering.svar
            ? { svar: vurdering.svar, begrunnelse: vurdering.begrunnelse || '' }
            : undefined;
        return acc;
    }, {} as SvarVilkårReiseTilSamling);
};

/**
 * Setter hvilke delvilkår som skal være aktive basert på eksisterende svar.
 *
 * Regler med svar aktiveres, og eventuelle nesteRegelId fra valgte svar aktiveres også.
 * Allerede aktiverte regler overskrives ikke.
 *
 * Til slutt filtreres resultatet mot avhengerAvHovedregler: en regel som avhenger av
 * andre (uavhengige) hovedregler blir kun stående som aktiv dersom alle disse er besvart Ja.
 * Dette gjør at f.eks. spørsmål 4 (som avhenger av spørsmål 1 og 2, i tillegg til å være
 * kjedet fra spørsmål 3) kun vises når alle tre foregående spørsmål er besvart Ja.
 */
export const initierAktiveDelvilkår = (
    svar: SvarVilkårReiseTilSamling,
    regelstruktur: RegelstrukturReiseTilSamling
): Map<RegelIdReiseTilSamling, boolean> => {
    const harEksisterendeSvar = Object.values(svar).find((svar) => svar !== undefined);

    const aktiveRegler = harEksisterendeSvar
        ? aktiveReglerFraEksisterendeSvar(svar, regelstruktur)
        : aktiveReglerForNyttVilkår(regelstruktur);

    return filtrerBortReglerSomErAvhengigAvUbesvarthovedregel(aktiveRegler, svar, regelstruktur);
};

const aktiveReglerFraEksisterendeSvar = (
    svar: SvarVilkårReiseTilSamling,
    regelstruktur: RegelstrukturReiseTilSamling
): Map<RegelIdReiseTilSamling, boolean> => {
    const aktiveRegler = new Map<RegelIdReiseTilSamling, boolean>();

    Object.entries(regelstruktur).forEach(([regelId, regelInfo]) => {
        const regelIdReiseTilSamling = regelId as RegelIdReiseTilSamling;
        const eksisterendeSvar = svar[regelIdReiseTilSamling]?.svar;

        const gjeldendeRegelErBesvart = eksisterendeSvar !== undefined;
        const harHåndtertRegelTidligere = aktiveRegler.has(regelIdReiseTilSamling);

        if (!harHåndtertRegelTidligere) {
            aktiveRegler.set(regelIdReiseTilSamling, regelInfo.erHovedregel);
        }

        if (gjeldendeRegelErBesvart && aktiveRegler.get(regelIdReiseTilSamling)) {
            const valgtAlternativ = regelInfo.svaralternativer.find(
                (svaralternativ) => svaralternativ.svarId === eksisterendeSvar
            );

            if (valgtAlternativ?.nesteRegelId) {
                aktiveRegler.set(valgtAlternativ.nesteRegelId, true);
            }
        }
    });

    return aktiveRegler;
};

const aktiveReglerForNyttVilkår = (
    regelstruktur: RegelstrukturReiseTilSamling
): Map<RegelIdReiseTilSamling, boolean> =>
    new Map(
        Object.entries(regelstruktur).map(([regelId, regelInfo]) => [
            regelId as RegelIdReiseTilSamling,
            regelInfo.erHovedregel,
        ])
    );

const filtrerBortReglerSomErAvhengigAvUbesvarthovedregel = (
    aktiveRegler: Map<RegelIdReiseTilSamling, boolean>,
    svar: SvarVilkårReiseTilSamling,
    regelstruktur: RegelstrukturReiseTilSamling
): Map<RegelIdReiseTilSamling, boolean> => {
    const resultat = new Map(aktiveRegler);

    Object.entries(regelstruktur).forEach(([regelId, regelInfo]) => {
        const regelIdReiseTilSamling = regelId as RegelIdReiseTilSamling;

        if (regelInfo.avhengerAvHovedregler.length === 0) {
            return;
        }

        const alleAvhengigheterErBesvartJa = regelInfo.avhengerAvHovedregler.every(
            (avhengighet) => svar[avhengighet]?.svar === 'JA'
        );

        if (!alleAvhengigheterErBesvartJa) {
            resultat.set(regelIdReiseTilSamling, false);
            regelInfo.reglerSomMåNullstilles.forEach((etterkommer) => {
                resultat.set(etterkommer, false);
            });
        }
    });

    return resultat;
};

/**
 * Fjerner svar for regler som ikke lenger er aktive, slik at "foreldreløse" svar
 * (f.eks. et tidligere besvart spørsmål 5 som nå er skjult fordi spørsmål 1 endret
 * seg til Nei) ikke blir stående igjen og sendt til backend som et ugyldig/uforeslutt svar.
 */
export const nullstillSvarForInaktiveRegler = (
    svar: SvarVilkårReiseTilSamling,
    aktiveRegler: Map<RegelIdReiseTilSamling, boolean>
): SvarVilkårReiseTilSamling =>
    Object.fromEntries(
        Object.entries(svar).map(([regelId, verdi]) => [
            regelId,
            aktiveRegler.get(regelId as RegelIdReiseTilSamling) ? verdi : undefined,
        ])
    ) as SvarVilkårReiseTilSamling;

export const initierGjeldendeFaktaType = (
    vilkår: VilkårReiseTilSamling | undefined
): TypeVilkårFakta => {
    if (!vilkår?.fakta) {
        return 'REISE_TIL_SAMLING_UBESTEMT';
    }
    return typeReiseTilSamlingTilTypeVilkårFakta[vilkår.fakta.type];
};
export const finnBegrunnelsestypeForSvar = (
    svaralternativer: SvarAlternativ[],
    valgtSvar?: SvarId
): BegrunnelseRegel => {
    if (!valgtSvar) return BegrunnelseRegel.UTEN;

    const valgtAlternativ = svaralternativer.find(
        (svaralternativ) => svaralternativ.svarId === valgtSvar
    );

    return valgtAlternativ ? valgtAlternativ.begrunnelseType : BegrunnelseRegel.UTEN;
};

export const tomtSvar: SvarVilkårReiseTilSamling = {
    HAR_NØDVENDIGE_UTGIFTER_TIL_REISE_TIL_SAMLING: undefined,
    ER_SAMLING_OBLIGATORISK: undefined,
    AVSTAND_OVER_TRETTI_KM: undefined,
    KAN_REISE_MED_OFFENTLIG_TRANSPORT: undefined,
    DOKUMENTERTE_UTGIFTER: undefined,
    KAN_REISE_MED_EGEN_BIL: undefined,
};

export const tomtOffentligTransport: FaktaOffentligTransport = {
    type: 'OFFENTLIG_TRANSPORT',
    utgifterOffentligTransport: undefined,
    aktivitetId: undefined,
    aktivitetType: undefined,
};

export const tomtPrivatBil: FaktaPrivatBil = {
    type: 'PRIVAT_BIL',
    reiseavstand: undefined,
    aktivitetId: undefined,
    aktivitetType: undefined,
    bompenger: undefined,
    fergekostnad: undefined,
    parkering: undefined,
};
