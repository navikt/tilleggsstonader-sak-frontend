import { JaNei } from '../../common';

export interface FaktaUtdanning {
    søknadsgrunnlag?: SøknadsgrunnlagUtdanning;
}

interface SøknadsgrunnlagUtdanning {
    aktiviteter?: string[];
    annenUtdanning?: AnnenUtdanningType;
    harRettTilUtstyrsstipend?: {
        erLærlingEllerLiknende?: JaNei;
        harTidligereFullførtVgs?: JaNei;
    };
    harFunksjonsnedsettelse: JaNei;
}

enum AnnenUtdanningType {
    VIDEREGÅENDE = 'VIDEREGÅENDE',

    FORKURS = 'FORKURS',

    FAGSKOLE_HØGSKOLE_UNIVERSITET = 'FAGSKOLE_HØGSKOLE_UNIVERSITET',

    KURS_LIKNENDE = 'KURS_LIKNENDE',

    INGEN_UTDANNING = 'INGEN_UTDANNING',
}

export const annenUtdanningTypeTilTekst: Record<AnnenUtdanningType, string> = {
    VIDEREGÅENDE: 'Videregående',
    FORKURS: 'Forkurs',
    FAGSKOLE_HØGSKOLE_UNIVERSITET: 'Fagskole, Høyskole eller Universitet',
    KURS_LIKNENDE: 'Kurs eller lignende',
    INGEN_UTDANNING: 'Ingen utdanning',
};
