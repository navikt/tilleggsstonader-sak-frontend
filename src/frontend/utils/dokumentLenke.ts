import { tittelMedUrlGodkjenteTegn } from './utils';
import { DokumentInfo } from '../typer/dokument';

export const åpneFilIEgenTab = (
    journalpostId: string,
    dokumentinfoId: string,
    tittel: string
): void => {
    window.open(lenkeDokument(journalpostId, dokumentinfoId, tittel), '_blank');
};

export const lenkeDokumentInfo = (dokument: DokumentInfo): string =>
    lenkeDokument(dokument.journalpostId, dokument.dokumentInfoId, dokument.tittel);

export const lenkeDokument = (
    journalpostId: string,
    dokumentInfoId: string,
    tittel: string
): string =>
    `${lenkeDokumentUtenTittel(journalpostId, dokumentInfoId)}/${tittelMedUrlGodkjenteTegn(tittel)}`;

export const lenkeDokumentUtenTittel = (journalpostId: string, dokumentInfoId: string) =>
    `/dokument/journalpost/${journalpostId}/dokument-pdf/${dokumentInfoId}`;
