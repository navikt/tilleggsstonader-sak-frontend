import { Periode } from '../../../utils/periode';
import { JaNei } from '../../common';

export interface FaktaAktivtet {
    søknadsgrunnlag?: SøknadsgrunnlagAktivitet;
}

interface SøknadsgrunnlagAktivitet {
    aktiviteter: string[];
    annenAktivitet?: TypeAnnenAktivitet;
    lønnetAktivitet?: JaNei;
    dekkesUtgiftenAvAndre?: DekkesUtgiftenAvAndre;
}

export interface DekkesUtgiftenAvAndre {
    typeUtdanning: DagligReiseTypeUtdanning;
    lærling?: JaNei;
    arbeidsgiverDekkerUtgift?: JaNei;
    erUnder25år?: JaNei;
    betalerForReisenTilSkolenSelv?: JaNei;
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

export enum DagligReiseTypeUtdanning {
    VIDEREGÅENDE = 'VIDEREGÅENDE',
    OPPLÆRING_FOR_VOKSNE = 'OPPLÆRING_FOR_VOKSNE',
    ANNET_TILTAK = 'ANNET_TILTAK',
}

export const dagligReiseTypeUtdanningTilTekst: Record<DagligReiseTypeUtdanning, string> = {
    VIDEREGÅENDE: 'Videregående skole',
    OPPLÆRING_FOR_VOKSNE: 'Forberedende opplæring for voksne',
    ANNET_TILTAK: 'Annet tiltak',
};
