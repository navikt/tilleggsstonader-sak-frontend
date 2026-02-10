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
    FTRL_17_10 = 'FTRL_17_10',
    FTRL_17_15 = 'FTRL_17_15',
    FTRL_21_12 = 'FTRL_21_12',
    FTRL_22_13 = 'FTRL_22_13',
    FTRL_22_15 = 'FTRL_22_15',
    FTRL_22_17A = 'FTRL_22_17A',
}

enum TilleggsstønadforskriftenHjemmel {
    FS_TILL_ST_1_3_MOBILITET = 'FS_TILL_ST_1_3_MOBILITET',
    FS_TILL_ST_3_REISE = 'FS_TILL_ST_3_REISE',
    FS_TILL_ST_5 = 'FS_TILL_ST_5',
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
    ARBML_13: 'Arb.mark.lov § 13',
    ARBML_17: 'Arb.mark.lov § 17',
    ARBML_22: 'Arb.mark.lov § 22',
};

export const folketrygdlovenHjemmelTilVisningstekst: Record<FolketrygdlovenHjemmel, string> = {
    FTRL_11_A_3: 'Ftrl. § 11 A-3',
    FTRL_11_A_4: 'Ftrl. § 11 A-4',
    FTRL_11_A_4_3: 'Ftrl. § 11 A-4 3. ledd',
    FTRL_15_11: 'Ftrl. § 15-11',
    FTRL_17_10: 'Ftrl. § 17-10',
    FTRL_17_15: 'Ftrl. § 17-15',
    FTRL_21_12: 'Ftrl. § 21-12',
    FTRL_22_13: 'Ftrl. § 22-13',
    FTRL_22_15: 'Ftrl. § 22-15',
    FTRL_22_17A: 'Ftrl. § 22-17a',
};

export const TilleggsstønadforskriftenHjemmelTilVisningstekst: Record<
    TilleggsstønadforskriftenHjemmel,
    string
> = {
    FS_TILL_ST_1_3_MOBILITET: 'Til.st.forskr. § 1 3. ledd',
    FS_TILL_ST_3_REISE: 'Til.st.forskr § 3',
    FS_TILL_ST_5: 'Til.st.forskr § 5',
    FS_TILL_ST_6_FLYTTING: 'Til.st.forskr. § 6',
    FS_TILL_ST_8_BOLIG: 'Til.st.forskr. § 8',
    FS_TILL_ST_10_TILSYN: 'Til.st.forskr. § 10',
    FS_TILL_ST_12_LAEREMIDLER: 'Til.st.forskr. § 12',
    FS_TILL_ST_15_2: 'Til.st.forskr § 15 2. ledd',
    FS_TILL_ST_15_3: 'Til.st.forskr. § 15 3. ledd',
};

export const ForeldeseslovenHjemmelTilVisningstekst: Record<ForeldeseslovenHjemmel, string> = {
    FL_2_3: 'Foreld.lov §§ 2 og 3',
    FL_10: 'Foreld.lov § 10',
};

export const ForvaltningslovenHjemmelTilVisningstekst: Record<ForvaltningslovenHjemmel, string> = {
    FVL_11: 'Fvl. § 11',
    FVL_17: 'Fvl. § 17 ',
    FVL_18_19: 'Fvl. §§ 18 og 19 ',
    FVL_35: 'Fvl. § 35',
    FVL_41: 'Fvl. § 41 ',
    FVL_42: 'Fvl. § 42',
};

export const alleHjemlerTilVisningstekst: Record<Hjemmel, string> = {
    ...ArbeidsmarkedslovenHjemmelTilVisningstekst,
    ...folketrygdlovenHjemmelTilVisningstekst,
    ...TilleggsstønadforskriftenHjemmelTilVisningstekst,
    ...ForeldeseslovenHjemmelTilVisningstekst,
    ...ForvaltningslovenHjemmelTilVisningstekst,
};
