import { Stønadsperiode } from '../Sider/Behandling/Inngangsvilkår/typer/stønadsperiode';

export interface Vilkårsoppsummering {
    stønadsperioder: Stønadsperiode[];
    visVarselKontantstøtte: boolean;

    // Brukes disse feltene?
    aktivitet: boolean;
    målgruppe: boolean;
    stønadsperiode: boolean;
    passBarn: BarnOppsummering[];
}

export interface BarnOppsummering {
    barnId: string;
    ident: string;
    navn: string;
    alder?: number;
    alderNårStønadsperiodeBegynner?: number;
    oppfyllerAlleVilkår: boolean;
}
