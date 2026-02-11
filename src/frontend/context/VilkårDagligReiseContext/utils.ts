import { VilkårDagligReise } from '../../Sider/Behandling/Stønadsvilkår/DagligReise/typer/vilkårDagligReise';

export const oppdaterVilkårIListe = (
    vilkårFørEndring: VilkårDagligReise[],
    oppdatertVilkår: VilkårDagligReise
): VilkårDagligReise[] =>
    vilkårFørEndring.map((vilkår) => (vilkår.id === oppdatertVilkår.id ? oppdatertVilkår : vilkår));

export const fjernVilkårFraListe = (
    vilkårFørEndring: VilkårDagligReise[],
    slettetVilkårId: string
): VilkårDagligReise[] => vilkårFørEndring.filter((vilkår) => vilkår.id !== slettetVilkårId);

export const settInnVilkårEtter = (
    vilkårFørEndring: VilkårDagligReise[],
    nyttVilkår: VilkårDagligReise,
    etterVilkårId: string
): VilkårDagligReise[] => {
    const index = vilkårFørEndring.findIndex((vilkår) => vilkår.id === etterVilkårId);
    if (index === -1) {
        // Hvis kilde-vilkåret ikke finnes, legg til på slutten
        return [...vilkårFørEndring, nyttVilkår];
    }
    return [
        ...vilkårFørEndring.slice(0, index + 1),
        nyttVilkår,
        ...vilkårFørEndring.slice(index + 1),
    ];
};
