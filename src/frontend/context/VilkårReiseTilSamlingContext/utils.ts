import { VilkårReiseTilSamling } from '../../Sider/Behandling/Stønadsvilkår/ReiseTilSamling/typer/vilkårReiseTilSamling';

export const oppdaterVilkårIListe = (
    eksisterendeVilkår: VilkårReiseTilSamling[],
    oppdatertVilkår: VilkårReiseTilSamling
): VilkårReiseTilSamling[] =>
    eksisterendeVilkår.map((vilkår) =>
        vilkår.id === oppdatertVilkår.id ? oppdatertVilkår : vilkår
    );

export const fjernVilkårFraListe = (
    eksisterendeVilkår: VilkårReiseTilSamling[],
    slettetVilkårId: string
): VilkårReiseTilSamling[] => eksisterendeVilkår.filter((vilkår) => vilkår.id !== slettetVilkårId);
