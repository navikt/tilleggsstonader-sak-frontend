import { v7 } from 'uuid';

import { BegrunnelseRegel, SvarId } from '../../../../../typer/regel';
import {
    FaktaOffentligTransport,
    typeDagligReiseTilTypeVilkårfakta,
} from '../typer/faktaDagligReise';
import {
    RegelIdDagligReise,
    Regelstruktur,
    SvarAlternativ,
    TypeVilkårFakta,
} from '../typer/regelstrukturDagligReise';
import { SvarVilkårDagligReise, VilkårDagligReise } from '../typer/vilkårDagligReise';

export const initierSvar = (
    eksisterendeVilkår: VilkårDagligReise | undefined
): SvarVilkårDagligReise => {
    if (!eksisterendeVilkår) {
        return tomtSvar;
    }

    const delvilkår = eksisterendeVilkår.delvilkårsett[0]; // Daglig reise har kun ett delvilkårsett

    return delvilkår.vurderinger.reduce((acc, vurdering) => {
        acc[vurdering.regelId as RegelIdDagligReise] = vurdering.svar
            ? { svar: vurdering.svar, begrunnelse: vurdering.begrunnelse || '' }
            : undefined;
        return acc;
    }, {} as SvarVilkårDagligReise);
};

/**
 * Setter hvilke delvilkår som skal være aktive basert på eksisterende svar.
 *
 * Regler med svar aktiveres, og eventuelle nesteRegelId fra valgte svar aktiveres også.
 * Allerede aktiverte regler overskrives ikke.
 */
export const initierAktiveDelvilkår = (
    svar: SvarVilkårDagligReise,
    regelstruktur: Regelstruktur
): Map<RegelIdDagligReise, boolean> => {
    const harEksisterendeSvar = Object.values(svar).find((svar) => svar !== undefined);

    if (harEksisterendeSvar) {
        const aktiveRegler = new Map<RegelIdDagligReise, boolean>();

        Object.entries(regelstruktur).forEach(([regelId, regelInfo]) => {
            const regelIdDagligReise = regelId as RegelIdDagligReise;
            const eksisterendeSvar = svar[regelIdDagligReise]?.svar;

            const gjeldendeRegelErBesvart = eksisterendeSvar !== undefined;
            const harHåndtertRegelTidligere = aktiveRegler.has(regelIdDagligReise);

            if (harHåndtertRegelTidligere === false) {
                aktiveRegler.set(regelIdDagligReise, gjeldendeRegelErBesvart);
            }

            // Sett etterfølgelde regelId-er til aktive dersom regel er besvart
            if (gjeldendeRegelErBesvart) {
                const valgtAlternativ = regelInfo.svaralternativer.find(
                    (svaralternativ) => svaralternativ.svarId === eksisterendeSvar
                );

                if (valgtAlternativ?.nesteRegelId) {
                    aktiveRegler.set(valgtAlternativ.nesteRegelId, true);
                }
            }
        });

        return aktiveRegler;
    }

    // Hvis ingen eksisterende svar, sett kun hovedregeler som aktive
    return new Map(
        Object.entries(regelstruktur).map(([regelId, regelInfo]) => [
            regelId as RegelIdDagligReise,
            regelInfo.erHovedregel,
        ])
    );
};

export const initierGjeldendeFaktaType = (
    vilkår: VilkårDagligReise | undefined
): TypeVilkårFakta | undefined => {
    return vilkår?.fakta ? typeDagligReiseTilTypeVilkårfakta[vilkår.fakta.type] : undefined;
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

export const tomtSvar: SvarVilkårDagligReise = {
    AVSTAND_OVER_SEKS_KM: undefined,
    UNNTAK_SEKS_KM: undefined,
    KAN_REISE_MED_OFFENTLIG_TRANSPORT: undefined,
    KAN_KJØRE_MED_EGEN_BIL: undefined,
};

export const tomtOffentligTransport: FaktaOffentligTransport = {
    type: 'OFFENTLIG_TRANSPORT',
    reiseId: v7(),
    reisedagerPerUke: undefined,
    prisEnkelbillett: undefined,
    prisSyvdagersbillett: undefined,
    prisTrettidagersbillett: undefined,
};
