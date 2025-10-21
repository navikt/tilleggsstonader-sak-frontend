import { BegrunnelseRegel, SvarId } from '../../../../../typer/regel';
import {
    FaktaOffentligTransport,
    typeDagligReiseTilTypeVilkårfakta,
} from '../typer/faktaDagligReise';
import {
    Regelstruktur,
    RegelIdDagligReise,
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
            const harSvar = eksisterendeSvar !== undefined;

            // Unngå at regler som er trigget av tidligere svar overskrives fordi selve regelen ikke har svar
            if (!aktiveRegler.has(regelIdDagligReise)) {
                aktiveRegler.set(regelIdDagligReise, harSvar);
            }

            // Vis neste regel dersom et eksisterende svar peker videre på en ny regel
            if (harSvar) {
                const valgtAlternativ = regelInfo.svaralternativer.find(
                    (alt) => alt.svarId === eksisterendeSvar
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
    KAN_BRUKER_REISE_MED_OFFENTLIG_TRANSPORT: undefined,
    KAN_BRUKER_KJØRE_SELV: undefined,
};

export const tomtOffentligTransport: FaktaOffentligTransport = {
    '@type': 'FAKTA_DAGLIG_REISE_OFFENTLIG_TRANSPORT',
    type: 'OFFENTLIG_TRANSPORT',
    reisedagerPerUke: undefined,
    prisEnkelbillett: undefined,
    prisSyvdagersbillett: undefined,
    prisTrettidagersbillett: undefined,
};
