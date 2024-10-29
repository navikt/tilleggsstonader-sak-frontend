export interface ArenaSakOgVedtak {
    vedtak: ArenaVedtak[];
    saker: Record<number, ArenaSak>;
}

export interface ArenaSak {
    målgruppe?: string;
    aktivitet?: ArenaAktivitet;
}

interface ArenaAktivitet {
    aktivitetId: number;
    type: string;
    status: string;
    fom?: string;
    tom?: string;
    beskrivelse?: string;
    gjelderUtdanning: boolean;
    typekode: string;
    statuskode: string;
}

export interface ArenaVedtak {
    sakId: number;
    type: string;
    status: string;
    rettighet: string;
    rettighetkode: string;
    fom?: string;
    tom?: string;
    totalbeløp?: number;
    datoInnstillt?: string;
    utfall?: string;
    vedtakfakta: Vedtakfakta[];
    vilkårsvurderinger: Vilkårsvurdering[];
    datoMottatt?: string;
    saksbehandler?: string;
    beslutter?: string;
}

interface Vedtakfakta {
    type: string;
    verdi?: string;
}

interface Vilkårsvurdering {
    vilkår: string;
    vurdering: string;
    vurdertAv?: string;
}
