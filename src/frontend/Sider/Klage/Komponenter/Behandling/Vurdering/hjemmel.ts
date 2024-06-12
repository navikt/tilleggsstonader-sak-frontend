enum ArbeidsmarkedslovenHjemmel {
    ARBML_13 = 'ARBML_13',
    ARBML_17 = 'ARBML_17',
    ARBML_22 = 'ARBML_22',
}

enum FolketrygdlovenHjemmel {
    FTRL_11_A_3 = 'FTRL_11_A_3',
    FTRL_11_A_4 = 'FTRL_11_A_4',
    FTRL_11_A_4_3 = 'FTRL_11_A_4_3',
    FTRL_15_11 = 'FTRL_15_11',
    FTRL_17_10_17_15 = 'FTRL_17_10_17_15',
    FTRL_21_12 = 'FTRL_21_12',
    FTRL_22_13 = 'FTRL_22_13',
    FTRL_22_15 = 'FTRL_22_15',
    FTRL_22_17A = 'FTRL_22_17A',
}

enum TilleggsstønadforskriftenHjemmel {
    FS_TILL_ST_1_3_MOBILITET = 'FS_TILL_ST_1_3_MOBILITET',
    FS_TILL_ST_3_REISE = 'FS_TILL_ST_3_REISE',
    FS_TILL_ST_6_FLYTTING = 'FS_TILL_ST_6_FLYTTING',
    FS_TILL_ST_8_BOLIG = 'FS_TILL_ST_8_BOLIG',
    FS_TILL_ST_10_TILSYN = 'FS_TILL_ST_10_TILSYN',
    FS_TILL_ST_12_LAEREMIDLER = 'FS_TILL_ST_12_LAEREMIDLER',
    FS_TILL_ST_15_2 = 'FS_TILL_ST_15_2',
    FS_TILL_ST_15_3 = 'FS_TILL_ST_15_3',
}

enum ForeldeseslovenHjemmel {
    FL_2_3 = 'FL_2_3',
    FL_10 = 'FL_10',
}

enum ForvaltningslovenHjemmel {
    FVL_11 = 'FVL_11',
    FVL_17 = 'FVL_17',
    FVL_18_19 = 'FVL_18_19',
    FVL_35 = 'FVL_35',
    FVL_41 = 'FVL_41',
    FVL_42 = 'FVL_42',
}

export type Hjemmel =
    | ArbeidsmarkedslovenHjemmel
    | FolketrygdlovenHjemmel
    | TilleggsstønadforskriftenHjemmel
    | ForeldeseslovenHjemmel
    | ForvaltningslovenHjemmel;

export const ArbeidsmarkedslovenHjemmelTilVisningstekst: Record<
    ArbeidsmarkedslovenHjemmel,
    string
> = {
    ARBML_13: 'ARBML_13',
    ARBML_17: 'ARBML_17',
    ARBML_22: 'ARBML_22',
};

export const folketrygdlovenHjemmelTilVisningstekst: Record<FolketrygdlovenHjemmel, string> = {
    FTRL_11_A_3: 'FTRL_11_A_3',
    FTRL_11_A_4: 'FTRL_11_A_4',
    FTRL_11_A_4_3: 'FTRL_11_A_4_3',
    FTRL_15_11: 'FTRL_15_11',
    FTRL_17_10_17_15: 'FTRL_17_10_17_15',
    FTRL_21_12: 'FTRL_21_12',
    FTRL_22_13: 'FTRL_22_13',
    FTRL_22_15: 'FTRL_22_15',
    FTRL_22_17A: 'FTRL_22_17A',
};

export const TilleggsstønadforskriftenHjemmelTilVisningstekst: Record<
    TilleggsstønadforskriftenHjemmel,
    string
> = {
    FS_TILL_ST_1_3_MOBILITET: 'FS_TILL_ST_1_3_MOBILITET',
    FS_TILL_ST_3_REISE: 'FS_TILL_ST_3_REISE',
    FS_TILL_ST_6_FLYTTING: 'FS_TILL_ST_6_FLYTTING',
    FS_TILL_ST_8_BOLIG: 'FS_TILL_ST_8_BOLIG',
    FS_TILL_ST_10_TILSYN: 'FS_TILL_ST_10_TILSYN',
    FS_TILL_ST_12_LAEREMIDLER: 'FS_TILL_ST_12_LAEREMIDLER',
    FS_TILL_ST_15_2: 'FS_TILL_ST_15_2',
    FS_TILL_ST_15_3: 'FS_TILL_ST_15_3',
};

export const ForeldeseslovenHjemmelTilVisningstekst: Record<ForeldeseslovenHjemmel, string> = {
    FL_2_3: 'FL_2_3',
    FL_10: 'FL_10',
};

export const ForvaltningslovenHjemmelTilVisningstekst: Record<ForvaltningslovenHjemmel, string> = {
    FVL_11: 'FVL_11',
    FVL_17: 'FVL_17',
    FVL_18_19: 'FVL_18_19',
    FVL_35: 'FVL_35',
    FVL_41: 'FVL_41',
    FVL_42: 'FVL_42',
};

export const alleHjemlerTilVisningstekst: Record<Hjemmel, string> = {
    ...ArbeidsmarkedslovenHjemmelTilVisningstekst,
    ...folketrygdlovenHjemmelTilVisningstekst,
    ...TilleggsstønadforskriftenHjemmelTilVisningstekst,
    ...ForeldeseslovenHjemmelTilVisningstekst,
    ...ForvaltningslovenHjemmelTilVisningstekst,
};
