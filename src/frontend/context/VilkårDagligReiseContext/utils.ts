import { VilkårDagligReise } from '../../Sider/Behandling/Stønadsvilkår/DagligReise/typer/vilkårDagligReise';

export const oppdaterVilkårIListe = (
    eksisterendeVilkår: VilkårDagligReise[],
    oppdatertVilkår: VilkårDagligReise
): VilkårDagligReise[] =>
    eksisterendeVilkår.map((vilkår) =>
        vilkår.id === oppdatertVilkår.id ? oppdatertVilkår : vilkår
    );

export const fjernVilkårFraListe = (
    eksisterendeVilkår: VilkårDagligReise[],
    slettetVilkårId: string
): VilkårDagligReise[] => eksisterendeVilkår.filter((vilkår) => vilkår.id !== slettetVilkårId);
