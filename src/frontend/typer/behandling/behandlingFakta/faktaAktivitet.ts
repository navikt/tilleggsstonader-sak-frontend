import { JaNei } from '../../common';

export interface FaktaAktivtet {
    søknadsgrunnlag?: SøknadsgrunnlagAktivitet;
}

interface SøknadsgrunnlagAktivitet {
    aktiviteter: string[];
    annenAktivitet?: TypeAnnenAktivitet;
    lønnetAktivitet?: JaNei;
}

export enum TypeAnnenAktivitet {
    TILTAK = 'TILTAK',
    UTDANNING = 'UTDANNING',
    ARBEIDSSØKER = 'ARBEIDSSØKER',
    INGEN_AKTIVITET = 'INGEN_AKTIVITET',
}

export const typeAnnenAktivitetTilTekst: Record<TypeAnnenAktivitet, string> = {
    TILTAK: 'Tiltak',
    UTDANNING: 'Utdanning',
    ARBEIDSSØKER: 'Arbeidssøker',
    INGEN_AKTIVITET: 'Ingen aktivitet',
};
