import { VilkårDagligReise } from '../../Sider/Behandling/Stønadsvilkår/DagligReise/typer/vilkårDagligReise';

export const oppdaterVilkårIListe = (
    vilkårFørEndring: VilkårDagligReise[],
    oppdatertVilkår: VilkårDagligReise
): VilkårDagligReise[] =>
    vilkårFørEndring.map((vilkår) => (vilkår.id === oppdatertVilkår.id ? oppdatertVilkår : vilkår));

export const fjernFraListe = (
    vilkårFørEndring: VilkårDagligReise[],
    slettetVilkårId: string
): VilkårDagligReise[] => vilkårFørEndring.filter((vilkår) => vilkår.id !== slettetVilkårId);
