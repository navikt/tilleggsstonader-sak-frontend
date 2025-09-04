import { Periode } from '../../../utils/periode';
import { JaNei } from '../../common';

export interface FaktaAktivtet {
    søknadsgrunnlag?: SøknadsgrunnlagAktivitet;
}

interface SøknadsgrunnlagAktivitet {
    aktiviteter: string[];
    annenAktivitet?: TypeAnnenAktivitet;
    lønnetAktivitet?: JaNei;
}
export interface FaktaAktivitetDagligReise {
    aktivitet: FaktaAktivtet;
    reiseTilAktivitetsstedHelePerioden?: JaNei;
    reiseperiode: Periode;
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
    INGEN_AKTIVITET: 'Ingen relevant aktivitet',
};
