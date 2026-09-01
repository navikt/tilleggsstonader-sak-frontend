import { BegrunnelseRegel, SvarId } from '../../../../../typer/regel';
import { Aktivitet } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import {
    FaktaOffentligTransport,
    FaktaPrivatBil,
    typeReiseOppstartAvslutningHjemreiseTilTypeVilkårFakta,
} from '../typer/faktaReiseOppstartAvslutningHjemreise';
import {
    RegelIdReiseOppstartAvslutningHjemreise,
    RegelstrukturReiseOppstartAvslutningHjemreise,
    SvarAlternativ,
    TypeVilkårFakta,
} from '../typer/regelstrukturReiseOppstartAvslutningHjemreise';
import {
    SvarVilkårReiseOppstartAvslutningHjemreise,
    VilkårReiseOppstartAvslutningHjemreise,
} from '../typer/vilkårReiseOppstartAvslutningHjemreise';

export const initierSvar = (
    eksisterendeVilkår: VilkårReiseOppstartAvslutningHjemreise | undefined
): SvarVilkårReiseOppstartAvslutningHjemreise => {
    if (!eksisterendeVilkår) {
        return tomtSvar;
    }

    const delvilkår = eksisterendeVilkår.delvilkårsett[0]; // Har kun ett delvilkårsett

    return delvilkår.vurderinger.reduce((acc, vurdering) => {
        acc[vurdering.regelId as RegelIdReiseOppstartAvslutningHjemreise] = vurdering.svar
            ? { svar: vurdering.svar, begrunnelse: vurdering.begrunnelse || '' }
            : undefined;
        return acc;
    }, {} as SvarVilkårReiseOppstartAvslutningHjemreise);
};

/**
 * Setter hvilke delvilkår som skal være aktive basert på eksisterende svar.
 *
 * Regler med svar aktiveres, og eventuelle nesteRegelId fra valgte svar aktiveres også.
 * Allerede aktiverte regler overskrives ikke.
 */
export const initierAktiveDelvilkår = (
    svar: SvarVilkårReiseOppstartAvslutningHjemreise,
    regelstruktur: RegelstrukturReiseOppstartAvslutningHjemreise
): Map<RegelIdReiseOppstartAvslutningHjemreise, boolean> => {
    const harEksisterendeSvar = Object.values(svar).find((svar) => svar !== undefined);

    if (harEksisterendeSvar) {
        const aktiveRegler = new Map<RegelIdReiseOppstartAvslutningHjemreise, boolean>();

        Object.entries(regelstruktur).forEach(([regelId, regelInfo]) => {
            const regelIdReiseOppstartAvslutningHjemreise =
                regelId as RegelIdReiseOppstartAvslutningHjemreise;
            const eksisterendeSvar = svar[regelIdReiseOppstartAvslutningHjemreise]?.svar;

            const gjeldendeRegelErBesvart = eksisterendeSvar !== undefined;
            const harHåndtertRegelTidligere = aktiveRegler.has(
                regelIdReiseOppstartAvslutningHjemreise
            );

            if (!harHåndtertRegelTidligere) {
                aktiveRegler.set(regelIdReiseOppstartAvslutningHjemreise, gjeldendeRegelErBesvart);
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
            regelId as RegelIdReiseOppstartAvslutningHjemreise,
            regelInfo.erHovedregel,
        ])
    );
};

export const initierGjeldendeFaktaType = (
    vilkår: VilkårReiseOppstartAvslutningHjemreise | undefined
): TypeVilkårFakta => {
    if (!vilkår?.fakta) {
        return 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_UBESTEMT';
    }
    return typeReiseOppstartAvslutningHjemreiseTilTypeVilkårFakta[vilkår.fakta.type];
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

export const tomtSvar: SvarVilkårReiseOppstartAvslutningHjemreise = {
    KAN_REISE_MED_OFFENTLIG_TRANSPORT: undefined,
    KAN_REISE_MED_EGEN_BIL: undefined,
};

export const tomtOffentligTransport = (aktivitet: Aktivitet): FaktaOffentligTransport => ({
    type: 'OFFENTLIG_TRANSPORT',
    utgifterOffentligTransport: undefined,
    aktivitetId: aktivitet.globalId,
    aktivitetType: aktivitet.type,
});

export const tomtPrivatBil = (aktivitet: Aktivitet): FaktaPrivatBil => ({
    type: 'PRIVAT_BIL',
    reiseavstand: undefined,
    aktivitetId: aktivitet.globalId,
    aktivitetType: aktivitet.type,
    bompenger: undefined,
    fergekostnad: undefined,
});
