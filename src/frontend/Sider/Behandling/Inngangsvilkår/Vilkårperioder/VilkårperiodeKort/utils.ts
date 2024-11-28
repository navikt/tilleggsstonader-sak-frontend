import { AktivitetFaktaOgVurderinger } from '../../typer/aktivitet';
import { MålgruppeVurderinger } from '../../typer/målgruppe';
import { VilkårPeriodeResultat } from '../../typer/vilkårperiode';

export type DelvilkårKey =
    | 'medlemskap'
    | 'utgifterDekketAvAnnetRegelverk'
    | 'lønnet'
    | 'harUtgifter';

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
