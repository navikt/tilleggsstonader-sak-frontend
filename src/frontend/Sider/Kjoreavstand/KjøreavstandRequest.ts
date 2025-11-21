export type KjøreavstandRequest = {
    fraAdresse: ReiseAdresse;
    tilAdresse: ReiseAdresse;
};

export type ReiseAdresse = {
    gate: string;
    postnummer: string;
    poststed: string;
};
