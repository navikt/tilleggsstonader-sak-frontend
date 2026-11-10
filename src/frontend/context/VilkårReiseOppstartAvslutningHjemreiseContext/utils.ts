import {
    AktivitetMedReiser,
    VilkårROAH,
} from '../../Sider/Behandling/Stønadsvilkår/ReiseOppstartAvslutningHjemreise/typer/vilkårReiseOppstartAvslutningHjemreise';

export const oppdaterVilkårIListe = (
    eksisterendeVilkår: VilkårROAH[],
    oppdatertVilkår: VilkårROAH
): VilkårROAH[] =>
    eksisterendeVilkår.map((vilkår) =>
        vilkår.id === oppdatertVilkår.id ? oppdatertVilkår : vilkår
    );

export const fjernVilkårFraListe = (
    eksisterendeVilkår: VilkårROAH[],
    slettetVilkårId: string
): VilkårROAH[] => eksisterendeVilkår.filter((vilkår) => vilkår.id !== slettetVilkårId);

export const vilkårFraAktiviteter = (aktiviteter: AktivitetMedReiser[]): VilkårROAH[] =>
    aktiviteter.flatMap((aktivitet) => [...aktivitet.reiser, ...aktivitet.paraplyvilkår]);
