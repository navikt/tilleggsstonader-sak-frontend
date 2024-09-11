import { Stønadsperiode } from '../Sider/Behandling/Inngangsvilkår/typer/stønadsperiode';

export interface Vilkårsoppsummering {
    stønadsperioder: Stønadsperiode[];
    visVarselKontantstøtte: boolean;
}
