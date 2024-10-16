export interface ArenaSakOgVedtak {
    vedtak: ArenaVedtak[];
    saker: Record<number, ArenaSak>; // Using Record for mapping Int to SakDto
}

export interface ArenaSak {
    målgruppe?: string;
    aktivitet?: ArenaAktivitet;
}

interface ArenaAktivitet {
    aktivitetId: number;
    type: string;
    status: string;
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
}

interface Vedtakfakta {
    type: string;
    verdi?: string;
}
