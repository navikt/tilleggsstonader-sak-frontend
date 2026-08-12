import { LocalDate } from '../../../../utils/dato';

export interface KjørelisteOversiktDto {
    tilgjengeligeReiser: ManuellRegistreringReise[];
    kjørelisterLagretIBehandling: ManueltInnsendtKjørelisteUke[];
}

export interface ManueltInnsendtKjørelisteUke {
    id: string;
    reiseFom: LocalDate;
    reiseTom: LocalDate;
    aktivitetsadresse?: string;
    journalpostId: string;
    begrunnelse?: string;
    innsendteUker: KjørelisteUke[];
}

export interface KjørelisteUke {
    ukenummer: number;
    fom: LocalDate;
    tom: LocalDate;
    dager: KjørelisteDag[];
}

export interface OppdaterKjørelisteUkeRequest {
    fom: string;
    dager: KjørelisteDag[];
}

export interface OppdaterKjørelisteRequest {
    begrunnelse?: string;
    uker: OppdaterKjørelisteUkeRequest[];
}

export interface KjørelisteDag {
    dato: string;
    harKjørt: boolean;
    parkeringsutgift?: number;
}

export interface ManuellRegistreringReise {
    reiseId: string;
    aktivitetsadresse?: string;
    fom: string;
    tom: string;
    uker: ManuellRegistreringUkeDto[];
}

export interface ManuellRegistreringUkeDto {
    ukenummer: number;
    fom: string;
    tom: string;
    innsendtTidligere: boolean;
    dager: LocalDate[];
}

export interface ManuellKjørelisteRequest {
    journalpostId: string;
    reiseId: string;
    begrunnelse?: string;
    reisedager: KjørelisteDag[];
}
