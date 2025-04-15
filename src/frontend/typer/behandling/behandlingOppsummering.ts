import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { MålgruppeType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';
import { VilkårPeriodeResultat } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { TypeVedtak } from '../vedtak/vedtak';

export interface BehandlingOppsummering {
    aktiviteter: OppsummertVilkårperiode<AktivitetType>[];
    målgrupper: OppsummertVilkårperiode<MålgruppeType>[];
    vilkår: Stønadsvilkår[];
    vedtaksresultat?: TypeVedtak;
    finnesOppsummeringData: boolean;
}

export type OppsummertVilkårperiode<T extends AktivitetType | MålgruppeType> = {
    id: string;
    fom: string;
    tom: string;
    resultat: VilkårPeriodeResultat;
    type: T;
};
