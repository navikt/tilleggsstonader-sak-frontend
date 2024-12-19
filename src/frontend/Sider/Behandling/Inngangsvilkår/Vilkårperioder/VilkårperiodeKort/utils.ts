import { AktivitetFaktaOgVurderinger } from '../../typer/vilkårperiode/aktivitet';
import { MålgruppeVurderinger } from '../../typer/vilkårperiode/målgruppe';
import { VilkårPeriodeResultat } from '../../typer/vilkårperiode/vilkårperiode';

export type DelvilkårKey =
    | 'medlemskap'
    | 'utgifterDekketAvAnnetRegelverk'
    | 'lønnet'
    | 'harUtgifter'
    | 'harRettTilUtstyrsstipend';

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
