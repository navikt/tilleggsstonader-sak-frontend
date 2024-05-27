export interface Vilkårsoppsummering {
    aktivitet: boolean;
    målgruppe: boolean;
    stønadsperiode: boolean;
    passBarn: BarnOppsummering[];
}

export interface BarnOppsummering {
    barnId: string;
    navn: string;
    alder?: number;
    oppfyllerAlleVilkår: boolean;
}
