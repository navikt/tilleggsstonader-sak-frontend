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

    const delvilkår = eksisterendeVilkår.delvilkårsett[0]; // Daglige reiser har kun ett delvilkårsett

    return delvilkår.vurderinger.reduce((acc, vurdering) => {
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
 */
export const initierAktiveDelvilkår = (
    svar: SvarVilkårReiseTilSamling,
    regelstruktur: RegelstrukturReiseTilSamling
): Map<RegelIdReiseTilSamling, boolean> => {
    const harEksisterendeSvar = Object.values(svar).find((svar) => svar !== undefined);

    if (harEksisterendeSvar) {
        const aktiveRegler = new Map<RegelIdReiseTilSamling, boolean>();

        Object.entries(regelstruktur).forEach(([regelId, regelInfo]) => {
            const regelIdReiseTilSamling = regelId as RegelIdReiseTilSamling;
            const eksisterendeSvar = svar[regelIdReiseTilSamling]?.svar;

            const gjeldendeRegelErBesvart = eksisterendeSvar !== undefined;
            const harHåndtertRegelTidligere = aktiveRegler.has(regelIdReiseTilSamling);

            if (!harHåndtertRegelTidligere) {
                aktiveRegler.set(regelIdReiseTilSamling, gjeldendeRegelErBesvart);
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
            regelId as RegelIdReiseTilSamling,
            regelInfo.erHovedregel,
        ])
    );
};

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
    AVSTAND_OVER_TRETTI_KM: undefined,
    KAN_REISE_MED_OFFENTLIG_TRANSPORT: undefined,
    DOKUMENTERTE_UTGIFTER: undefined,
    KAN_REISE_MED_EGEN_BIL: undefined,
    DEKKET_AV_ANNET_STIPEND: undefined,
};

export const tomtOffentligTransport: FaktaOffentligTransport = {
    type: 'OFFENTLIG_TRANSPORT',
    utgifterOffentligTransport: undefined,
};

export const tomtPrivatBil: FaktaPrivatBil = {
    type: 'PRIVAT_BIL',
    reiseavstand: undefined,
};
