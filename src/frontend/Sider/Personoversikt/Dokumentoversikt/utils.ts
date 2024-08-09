import { DokumentInfo } from '../../../typer/dokument';
import { groupBy } from '../../../utils/utils';

export const grupperDokumenterPåJournalpost = (dokumenter: DokumentInfo[]) =>
    groupBy(dokumenter, (dokument) => dokument.journalpostId);

export const sorterJournalpostPåTid = (
    dokumentterGrupperPåJournalpost: Record<string, DokumentInfo[]>
) =>
    Object.keys(dokumentterGrupperPåJournalpost).sort(function (a, b) {
        const datoA = dokumentterGrupperPåJournalpost[a][0].dato;
        const datoB = dokumentterGrupperPåJournalpost[b][0].dato;
        if (!datoA) {
            return -1;
        } else if (!datoB) {
            return 1;
        }
        return datoA > datoB ? -1 : 1;
    });
