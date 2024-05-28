export enum FolketrygdHjemmel {
    FT_FEMTEN_TO = 'FT_FEMTEN_TO',
    FT_FEMTEN_TRE = 'FT_FEMTEN_TRE',
    FT_FEMTEN_FIRE = 'FT_FEMTEN_FIRE',
    FT_FEMTEN_FEM = 'FT_FEMTEN_FEM',
    FT_FEMTEN_SEKS = 'FT_FEMTEN_SEKS',
    FT_FEMTEN_ÅTTE = 'FT_FEMTEN_ÅTTE',
    FT_FEMTEN_NI = 'FT_FEMTEN_NI',
    FT_FEMTEN_TI = 'FT_FEMTEN_TI',
    FT_FEMTEN_ELLEVE = 'FT_FEMTEN_ELLEVE',
    FT_FEMTEN_TOLV = 'FT_FEMTEN_TOLV',
    FT_FEMTEN_TRETTEN = 'FT_FEMTEN_TRETTEN',
    FT_TJUETO_TOLV = 'FT_TJUETO_TOLV',
    FT_TJUETO_TRETTEN = 'FT_TJUETO_TRETTEN',
    FT_TJUETO_FEMTEN = 'FT_TJUETO_FEMTEN',
}

enum BarnetrygdlovenHjemmel {
    BT_TO = 'BT_TO',
    BT_FIRE = 'BT_FIRE',
    BT_FEM = 'BT_FEM',
    BT_NI = 'BT_NI',
    BT_TI = 'BT_TI',
    BT_ELLEVE = 'BT_ELLEVE',
    BT_TOLV = 'BT_TOLV',
    BT_TRETTEN = 'BT_TRETTEN',
    BT_SYTTEN = 'BT_SYTTEN',
    BT_ATTEN = 'BT_ATTEN',
}

enum KontantstøttelovenHjemmel {
    KS_TO = 'KS_TO',
    KS_TRE = 'KS_TRE',
    KS_SEKS = 'KS_SEKS',
    KS_SYV = 'KS_SYV',
    KS_ÅTTE = 'KS_ÅTTE',
    KS_NI = 'KS_NI',
    KS_TI = 'KS_TI',
    KS_ELLEVE = 'KS_ELLEVE',
    KS_TOLV = 'KS_TOLV',
    KS_TRETTEN = 'KS_TRETTEN',
    KS_SEKSTEN = 'KS_SEKSTEN',
}

enum UtlandsavtalerHjemmel {
    UTLAND_EØS = 'UTLAND_EØS',
    UTLAND_EØS_FORORDNINGEN_FEM = 'UTLAND_EØS_FORORDNINGEN_FEM',
    UTLAND_EØS_FORORDNINGEN_SEKS = 'UTLAND_EØS_FORORDNINGEN_SEKS',
    UTLAND_NORDISK = 'UTLAND_NORDISK',
    UTLAND_TRYGDEAVTALER = 'UTLAND_TRYGDEAVTALER',
}

export type Hjemmel =
    | FolketrygdHjemmel
    | BarnetrygdlovenHjemmel
    | KontantstøttelovenHjemmel
    | UtlandsavtalerHjemmel;

const barnetrygdlovenVisningstekster: Record<BarnetrygdlovenHjemmel, string> = {
    BT_TO: '§ 2 Hvem som har rett til barnetrygd',
    BT_FIRE: '§ 4 Bosatt i riket, lovlig opphold mm.',
    BT_FEM: '§ 5 Medlemskap i folketrygden under utenlandsopphold',
    BT_NI: '§ 9 Utvidet barnetrygd',
    BT_TI: '§ 10 Barnetrygdens størrelse',
    BT_ELLEVE: '§ 11 Stønadsperiode',
    BT_TOLV: '§ 12 Utbetaling',
    BT_TRETTEN: '§ 13 Tilbakekreving',
    BT_SYTTEN: '§ 17 Stønadsmottakers opplysningsplikt',
    BT_ATTEN: '§ 18 Uriktige opplysninger',
};

const kontantstøttelovenVisningstekster: Record<KontantstøttelovenHjemmel, string> = {
    KS_TO: '§ 2 Vilkår knyttet til barnet',
    KS_TRE: '§ 3 Vilkår knyttet til støttemottaker',
    KS_SEKS: '§ 6 Barn i fosterhjem eller institusjon',
    KS_SYV: '§ 7 Kontantstøttens størrelse',
    KS_ÅTTE: '§ 8 Stønadsperiode',
    KS_NI: '§ 9 Utbetaling av kontantstøtte - delt bosted',
    KS_TI: '§ 10 Utbetaling til adopterte barn',
    KS_ELLEVE: '§ 11 Tilbakekreving',
    KS_TOLV: '§ 12 Støttemottakerens opplysningsplikt',
    KS_TRETTEN: '§ 13 Avslag på søknad, stans i utbetalingen',
    KS_SEKSTEN: '§ 16 Opplysningsplikt',
};

const utlandsavtalerHjemmelVisningstekster: Record<UtlandsavtalerHjemmel, string> = {
    UTLAND_EØS: 'EØS-avtalen',
    UTLAND_EØS_FORORDNINGEN_FEM: 'EØS-forordningen art. 5',
    UTLAND_EØS_FORORDNINGEN_SEKS: 'EØS-forordningen art. 6',
    UTLAND_NORDISK: 'Nordisk konvensjon',
    UTLAND_TRYGDEAVTALER: 'Trygdeavtaler',
};

export const folketrygdHjemmelTilVisningstekst: Record<FolketrygdHjemmel, string> = {
    FT_FEMTEN_TO: '§ 15-2 Forutgående medlemskap',
    FT_FEMTEN_TRE: '§ 15-3 Opphold i Norge',
    FT_FEMTEN_FIRE: '§ 15-4 Enslig mor eller far',
    FT_FEMTEN_FEM: '§ 15-5 Overgangsstønad',
    FT_FEMTEN_SEKS: '§ 15-6 Plikt til yrkesrettet aktivitet',
    FT_FEMTEN_ÅTTE: '§ 15-8 Stønadsperiode',
    FT_FEMTEN_NI: '§ 15-9 Avkorting mot inntekt',
    FT_FEMTEN_TI: '§ 15-10 Stønad til barnetilsyn',
    FT_FEMTEN_ELLEVE: '§ 15-11 Stønad til skolepenger',
    FT_FEMTEN_TOLV: '§ 15-12 Sanksjon',
    FT_FEMTEN_TRETTEN: '§ 15-13 Forholdet til andre folketrygdytelser',
    FT_TJUETO_TOLV:
        '§ 22-12 Tidspunkt for utbetaling når rett til en ytelse oppstår eller opphører',
    FT_TJUETO_TRETTEN:
        '§ 22-13 Frister for framsetting av krav, virkningstidspunkt og etterbetaling',
    FT_TJUETO_FEMTEN: '§ 22-15 Tilbakekreving',
};

export const baHjemlerTilVisningstekst: Record<
    BarnetrygdlovenHjemmel | UtlandsavtalerHjemmel,
    string
> = {
    ...barnetrygdlovenVisningstekster,
    ...utlandsavtalerHjemmelVisningstekster,
};

export const ksHjemlerTilVisningstekst: Record<
    KontantstøttelovenHjemmel | UtlandsavtalerHjemmel,
    string
> = {
    ...kontantstøttelovenVisningstekster,
    ...utlandsavtalerHjemmelVisningstekster,
};

export const alleHjemlerTilVisningstekst: Record<Hjemmel, string> = {
    ...folketrygdHjemmelTilVisningstekst,
    ...barnetrygdlovenVisningstekster,
    ...kontantstøttelovenVisningstekster,
    ...utlandsavtalerHjemmelVisningstekster,
};
