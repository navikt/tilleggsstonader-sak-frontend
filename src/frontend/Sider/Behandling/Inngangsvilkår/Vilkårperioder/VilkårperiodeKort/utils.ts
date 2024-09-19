import { DelvilkårAktivitet } from '../../typer/aktivitet';
import { DelvilkårMålgruppe } from '../../typer/målgruppe';
import { VilkårPeriodeResultat } from '../../typer/vilkårperiode';

export type TypeVilkårperiode = 'Målgruppe' | 'Aktivitet';

export type DelvilkårKey = Exclude<keyof DelvilkårMålgruppe | keyof DelvilkårAktivitet, '@type'>;

export const tittelSelectTypeVilkårperiode = (type: TypeVilkårperiode) => {
    switch (type) {
        case 'Målgruppe':
            return 'Ytelse/situasjon';
        case 'Aktivitet':
            return 'Type';
    }
};

export const finnDelvilkårTilOppsummering = (
    delvilkår: DelvilkårMålgruppe | DelvilkårAktivitet,
    resultat: VilkårPeriodeResultat
): DelvilkårKey[] => {
    if (resultat === VilkårPeriodeResultat.OPPFYLT || resultat === VilkårPeriodeResultat.SLETTET)
        return [];

    const delvilkårMedResultat: DelvilkårKey[] = [];

    Object.entries(delvilkår).forEach(([key, value]) => {
        if (key !== '@type' && value?.resultat === resultat) {
            delvilkårMedResultat.push(key as DelvilkårKey);
        }
    });

    return delvilkårMedResultat;
};
