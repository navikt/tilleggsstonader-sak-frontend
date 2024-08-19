export interface OppgaveArena {
    id: number;
    tittel: string;
    kommentar: string;
    fristFerdigstillelse: string;
    benk?: string;
    tildelt?: string;
    opprettetTidspunkt: string;
    målgruppe?: MålgruppeArena;
}

enum MålgruppeArena {
    ARBEIDSSØKER = 'ARBEIDSSØKER',
    ENSLIG_FORSØRGER_SØKER_ARBEID = 'ENSLIG_FORSØRGER_SØKER_ARBEID',
    ENSLIG_FORSØRGER_UTDANNING = 'ENSLIG_FORSØRGER_UTDANNING',
    GJENLEVENDE_SØKER_ARBEID = 'GJENLEVENDE_SØKER_ARBEID',
    GJENLEVENDE_UTDANNING = 'GJENLEVENDE_UTDANNING',
    DAGPENGER = 'DAGPENGER',
    TILTAKSPENGER = 'TILTAKSPENGER',
    NEDSATT_ARBEIDSEVNE = 'NEDSATT_ARBEIDSEVNE',
    TIDLIGERE_FAMILIEPLEIER_UTDANNING = 'TIDLIGERE_FAMILIEPLEIER_UTDANNING',
}

export const målgruppeArenaTilTekst: Record<MålgruppeArena, string> = {
    ARBEIDSSØKER: 'Arbeidssøker',
    ENSLIG_FORSØRGER_SØKER_ARBEID: 'Enslig forsørger - arbeidssøker',
    ENSLIG_FORSØRGER_UTDANNING: 'Enslig forsørger - under utdanning',
    GJENLEVENDE_SØKER_ARBEID: 'Gjenlevende - arbeidssøker',
    GJENLEVENDE_UTDANNING: 'Gjenlevende - under utdanning',
    DAGPENGER: 'Dagpenger',
    TILTAKSPENGER: 'Tiltakspenger',
    NEDSATT_ARBEIDSEVNE: 'Nedsatt arbeidsevne',
    TIDLIGERE_FAMILIEPLEIER_UTDANNING: 'Tidligere familiepleier',
};
