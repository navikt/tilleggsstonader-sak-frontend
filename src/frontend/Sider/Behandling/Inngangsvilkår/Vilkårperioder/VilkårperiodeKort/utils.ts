import { AktivitetFaktaOgVurderinger } from '../../typer/vilkårperiode/aktivitet';
import { AktivitetBarnetilsynFaktaOgVurderinger } from '../../typer/vilkårperiode/aktivitetBarnetilsyn';
import { AktivitetLæremidlerFaktaOgVurderinger } from '../../typer/vilkårperiode/aktivitetLæremidler';
import { MålgruppeVurderinger } from '../../typer/vilkårperiode/målgruppe';
import { VilkårPeriodeResultat } from '../../typer/vilkårperiode/vilkårperiode';

export type DelvilkårKey = Exclude<
    | keyof MålgruppeVurderinger
    | keyof AktivitetBarnetilsynFaktaOgVurderinger
    | keyof AktivitetLæremidlerFaktaOgVurderinger,
    '@type' | 'aktivitetsdager' | 'prosent' | 'studienivå'
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
