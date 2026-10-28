import { BegrunnelseRegel, SvarId } from '../../../../../typer/regel';
import {
    FaktaOffentligTransport,
    FaktaPrivatBil,
    FaktaReiseOppstartAvslutningHjemreiseUbestemt,
    typeReiseOppstartAvslutningHjemreiseTilTypeVilkårFakta,
} from '../typer/faktaReiseOppstartAvslutningHjemreise';
import {
    RegelIdROAH,
    Regelstruktur,
    RegelstrukturROAH,
    SvarAlternativ,
    TypeVilkårFakta,
} from '../typer/regelstrukturReiseOppstartAvslutningHjemreise';
import {
    SvarVilkårReiseOppstartAvslutningHjemreise,
    TypeReiseformål,
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
        acc[vurdering.regelId as RegelIdROAH] = vurdering.svar
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
    regelstruktur: Regelstruktur
): Map<RegelIdROAH, boolean> => {
    const harEksisterendeSvar = Object.values(svar).find((svar) => svar !== undefined);

    if (harEksisterendeSvar) {
        const aktiveRegler = new Map<RegelIdROAH, boolean>();

        Object.entries(regelstruktur).forEach(([regelId, regelInfo]) => {
            const regelIdROAH = regelId as RegelIdROAH;
            const eksisterendeSvar = svar[regelIdROAH]?.svar;

            const gjeldendeRegelErBesvart = eksisterendeSvar !== undefined;
            const harHåndtertRegelTidligere = aktiveRegler.has(regelIdROAH);

            if (harHåndtertRegelTidligere === false) {
                aktiveRegler.set(regelIdROAH, gjeldendeRegelErBesvart);
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
            regelId as RegelIdROAH,
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

export const finnStartRegelId = (regelstruktur: Regelstruktur): RegelIdROAH | undefined => {
    const hovedregel = Object.entries(regelstruktur).find(([, regel]) => regel?.erHovedregel);
    return hovedregel?.[0] as RegelIdROAH | undefined;
};

export const finnRegelstrukturForReiseformål = (
    regelstruktur: RegelstrukturROAH,
    typeReiseformål: TypeReiseformål | undefined
): Regelstruktur | undefined => {
    if (typeReiseformål === 'OPPSTART') {
        return regelstruktur.oppstart;
    }
    if (typeReiseformål === 'AVSLUTNING') {
        return regelstruktur.avslutning;
    }
    if (typeReiseformål === 'HJEMREISE') {
        return regelstruktur.hjemreise;
    }

    return undefined;
};

export const tomtSvar: SvarVilkårReiseOppstartAvslutningHjemreise = {
    ROAH_HAR_UTGIFTER_TIL_REISEN: undefined,
    ROAH_KAN_REISE_MED_OFFENTLIG_TRANSPORT: undefined,
    ROAH_HAR_DOKUMENTERTE_UTGIFTER_TIL_REISEN: undefined,
    ROAH_KAN_BENYTTE_PRIVAT_BIL: undefined,
    ROAH_BENYTTET_TAXI: undefined,
    ROAH_HJEMREISE_INNENFOR_NORMALT_ANTALL: undefined,
    ROAH_HJEMREISE_BEHOV_FLERE_REISER: undefined,
};

export const tomtUbestemtFakta: FaktaReiseOppstartAvslutningHjemreiseUbestemt = {
    type: 'UBESTEMT',
};

export const tomtOffentligTransport = (): FaktaOffentligTransport => ({
    type: 'OFFENTLIG_TRANSPORT',
    utgifterOffentligTransport: undefined,
    begrunnelse: undefined,
    nødvendigUtgift: undefined,
});

export const tomtPrivatBil = (): FaktaPrivatBil => ({
    type: 'PRIVAT_BIL',
    begrunnelse: undefined,
    nødvendigUtgift: undefined,
    reiseavstand: undefined,
    bompenger: undefined,
    fergekostnad: undefined,
    parkering: undefined,
    piggdekkavgift: undefined,
});
