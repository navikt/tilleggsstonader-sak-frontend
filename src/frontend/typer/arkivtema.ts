export enum Arkivtema {
    AAP = 'AAP',
    AAR = 'AAR',
    AGR = 'AGR',
    ARP = 'ARP',
    ARS = 'ARS',
    BAR = 'BAR',
    BID = 'BID',
    BIL = 'BIL',
    DAG = 'DAG',
    ENF = 'ENF',
    ERS = 'ERS',
    EYB = 'EYB',
    EYO = 'EYO',
    FAR = 'FAR',
    FEI = 'FEI',
    FIP = 'FIP',
    FOR = 'FOR',
    FOS = 'FOS',
    FRI = 'FRI',
    FUL = 'FUL',
    GEN = 'GEN',
    GRA = 'GRA',
    GRU = 'GRU',
    HEL = 'HEL',
    HJE = 'HJE',
    IAR = 'IAR',
    IND = 'IND',
    KON = 'KON',
    KLL = 'KLL',
    KTA = 'KTA',
    KTR = 'KTR',
    MED = 'MED',
    MOB = 'MOB',
    OMS = 'OMS',
    OPA = 'OPA',
    OPP = 'OPP',
    PEN = 'PEN',
    PER = 'PER',
    REH = 'REH',
    REK = 'REK',
    RPO = 'RPO',
    RVE = 'RVE',
    SAA = 'SAA',
    SAK = 'SAK',
    SAP = 'SAP',
    SER = 'SER',
    SIK = 'SIK',
    STO = 'STO',
    SUP = 'SUP',
    SYK = 'SYK',
    SYM = 'SYM',
    TIL = 'TIL',
    TRK = 'TRK',
    TRY = 'TRY',
    TSO = 'TSO',
    TSR = 'TSR',
    UFM = 'UFM',
    UFO = 'UFO',
    UKJ = 'UKJ',
    VEN = 'VEN',
    YRA = 'YRA',
    YRK = 'YRK',
}

export const arkivtemaerTilTekst: Record<Arkivtema, string> = {
    AAP: 'Arbeidsavklaringspenger',
    AAR: 'Aa-registeret',
    AGR: 'Ajourhold - Grunnopplysninger',
    ARP: 'Arbeidsrådgivning psykologtester',
    ARS: 'Arbeidsrådgivning skjermet',
    BAR: 'Barnetrygd',
    BID: 'Bidrag',
    BIL: 'Bil',
    DAG: 'Dagpenger',
    ENF: 'Enslig forsørger',
    ERS: 'Erstatning',
    EYB: 'Barnepensjon',
    EYO: 'Omstillingsstønad',
    FAR: 'Farskap',
    FEI: 'Feilutbetaling',
    FIP: 'Fiskerpensjon',
    FOR: 'Foreldre- og svangerskapspenger',
    FOS: 'Forsikring',
    FRI: 'Kompensasjon for selvstendig næringsdrivende/frilansere',
    FUL: 'Fullmakt',
    GEN: 'Generell',
    GRA: 'Gravferdsstønad',
    GRU: 'Grunn- og hjelpestønad',
    HEL: 'Helsetjenester og ortopediske hjelpemidler',
    HJE: 'Hjelpemidler',
    IAR: 'Inkluderende arbeidsliv',
    IND: 'Tiltakspenger',
    KON: 'Kontantstøtte',
    KLL: 'Klage lønnsgaranti',
    KTA: 'Kontroll anmeldelse',
    KTR: 'Kontroll',
    MED: 'Medlemskap',
    MOB: 'Mobilitetsfremmende stønad',
    OMS: 'Omsorgspenger, pleiepenger og opplæringspenger',
    OPA: 'Oppfølging - Arbeidsgiver',
    OPP: 'Oppfølging',
    PEN: 'Pensjon',
    PER: 'Permittering og masseoppsigelser',
    REH: 'Rehabilitering',
    REK: 'Rekruttering og stilling',
    RPO: 'Retting av personopplysninger',
    RVE: 'Rettferdsvederlag',
    SAA: 'Sanksjon - Arbeidsgiver',
    SAK: 'Saksomkostninger',
    SAP: 'Sanksjon - Person',
    SER: 'Serviceklager',
    SIK: 'Sikkerhetstiltak',
    STO: 'Regnskap/utbetaling',
    SUP: 'Supplerende stønad',
    SYK: 'Sykepenger',
    SYM: 'Sykmeldinger',
    TIL: 'Tiltak',
    TRK: 'Trekkhåndtering',
    TRY: 'Trygdeavgift',
    TSO: 'Tilleggsstønad',
    TSR: 'Tilleggsstønad arbeidssøkere',
    UFM: 'Unntak fra medlemskap',
    UFO: 'Uføretrygd',
    UKJ: 'Ukjent',
    VEN: 'Ventelønn',
    YRA: 'Yrkesrettet attføring',
    YRK: 'Yrkesskade',
};

export const utledArkivtema = (tema: Arkivtema | undefined) =>
    tema ? arkivtemaerTilTekst[tema] : 'Tema ikke satt';
