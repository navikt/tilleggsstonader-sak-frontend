import { JaNei } from '../../common';

export interface FaktaUtdanning {
    søknadsgrunnlag?: SøknadsgrunnlagUtdanning;
}

interface SøknadsgrunnlagUtdanning {
    aktiviteter?: string[];
    annenUtdanning?: AnnenUtdanningType;
    mottarUtstyrsstipend?: JaNei;
    harFunksjonsnedsettelse: JaNei;
}

enum AnnenUtdanningType {
    VIDEREGÅENDE_FORKURS = 'VIDEREGÅENDE_FORKURS',

    FAGSKOLE_HØGSKOLE_UNIVERSITET = 'FAGSKOLE_HØGSKOLE_UNIVERSITET',

    KURS_LIKNENDE = 'KURS_LIKNENDE',

    INGEN_UTDANNING = 'INGEN_UTDANNING',
}

export const annenUtdanningTypeTilTekst: Record<AnnenUtdanningType, string> = {
    VIDEREGÅENDE_FORKURS: 'Videregående forkurs',
    FAGSKOLE_HØGSKOLE_UNIVERSITET: 'Fagskole, Høyskole eller Universitet',
    KURS_LIKNENDE: 'Kurs eller lignende',
    INGEN_UTDANNING: 'Ingen utdanning',
};
