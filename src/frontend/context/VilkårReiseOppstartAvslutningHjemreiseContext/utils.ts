import { VilkårReiseOppstartAvslutningHjemreise } from '../../Sider/Behandling/Stønadsvilkår/ReiseOppstartAvslutningHjemreise/typer/vilkårReiseOppstartAvslutningHjemreise';

export const oppdaterVilkårIListe = (
    eksisterendeVilkår: VilkårReiseOppstartAvslutningHjemreise[],
    oppdatertVilkår: VilkårReiseOppstartAvslutningHjemreise
): VilkårReiseOppstartAvslutningHjemreise[] =>
    eksisterendeVilkår.map((vilkår) =>
        vilkår.id === oppdatertVilkår.id ? oppdatertVilkår : vilkår
    );

export const fjernVilkårFraListe = (
    eksisterendeVilkår: VilkårReiseOppstartAvslutningHjemreise[],
    slettetVilkårId: string
): VilkårReiseOppstartAvslutningHjemreise[] =>
    eksisterendeVilkår.filter((vilkår) => vilkår.id !== slettetVilkårId);
