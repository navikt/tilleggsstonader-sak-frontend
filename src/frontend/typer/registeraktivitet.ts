export interface Registeraktivitet {
    id: string;
    fom?: string;
    tom?: string;
    type: string;
    typeNavn: string;
    status?: StatusAktivitet;
    statusArena?: string;
    antallDagerPerUke?: number;
    prosentDeltakelse?: number;
    erStønadsberettiget?: boolean;
    erUtdanning?: boolean;
    arrangør?: string;
    kilde: Kilde;
}

type Kilde = 'ARENA';

enum StatusAktivitet {
    VENTER_PA_OPPSTART = 'VENTER_PA_OPPSTART',
    AKTUELL = 'AKTUELL',
    DELTAR = 'DELTAR',
    AVBRUTT = 'AVBRUTT',
    FULLFØRT = 'FULLFØRT',
    OPPHØRT = 'OPPHØRT',
    OVERFØRT = 'OVERFØRT',
    BEHOV = 'BEHOV',
    IKKE_AKTUELL = 'IKKE_AKTUELL',
    FEILREGISTRERT = 'FEILREGISTRERT',
    PLANLAGT = 'PLANLAGT',
    VENTELISTE = 'VENTELISTE',
}

export const statutAktivitetTilTekst: Record<StatusAktivitet, string> = {
    VENTER_PA_OPPSTART: 'Venter på oppstart',
    AKTUELL: 'Aktuell',
    DELTAR: 'Deltar',
    AVBRUTT: 'Avbrutt',
    FULLFØRT: 'Fullført',
    OPPHØRT: 'Opphørt',
    OVERFØRT: 'Overført',
    BEHOV: 'Behov',
    IKKE_AKTUELL: 'Ikke aktuell',
    FEILREGISTRERT: 'Feilregistrert',
    PLANLAGT: 'Planlagt',
    VENTELISTE: 'Venteliste',
};
