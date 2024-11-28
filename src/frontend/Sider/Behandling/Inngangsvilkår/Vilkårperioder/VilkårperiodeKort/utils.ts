import { MålgruppeVurderinger } from '../../typer/målgruppe';
import {
    AktivitetBarnetilsynFaktaOgVurderinger,
    AktivitetFaktaOgVurderinger,
    AktivitetLæremidlerFaktaOgVurderinger,
} from '../../typer/vilkårperiode/aktivitet';
import { VilkårPeriodeResultat } from '../../typer/vilkårperiode/vilkårperiode';

export type DelvilkårKey = Exclude<
    | keyof MålgruppeVurderinger
    | keyof AktivitetBarnetilsynFaktaOgVurderinger
    | keyof AktivitetLæremidlerFaktaOgVurderinger,
    '@type' | 'aktivitetsdager' | 'prosent'
>;

export const finnDelvilkårTilOppsummering = (
    faktaOgVurderinger: MålgruppeVurderinger | AktivitetFaktaOgVurderinger,
    resultat: VilkårPeriodeResultat
): DelvilkårKey[] => {
    if (resultat === VilkårPeriodeResultat.OPPFYLT || resultat === VilkårPeriodeResultat.SLETTET)
        return [];

    const delvilkårMedResultat: DelvilkårKey[] = [];

    Object.entries(faktaOgVurderinger).forEach(([key, value]) => {
        if (key !== '@type' && value?.resultat === resultat) {
            delvilkårMedResultat.push(key as DelvilkårKey);
        }
    });

    return delvilkårMedResultat;
};
