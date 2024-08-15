import { compareDesc } from 'date-fns';

import { formaterNullableIsoDatoTid } from '../../../../utils/dato';
import { åpneFilIEgenTab } from '../../../../utils/utils';
import { DokumentProps } from '../../familie-felles-frontend/familie-dokumentliste';

export const sorterDokumentlisten = (dokumenter: DokumentProps[]) => {
    return dokumenter
        .sort((a, b) => {
            if (!a.dato) {
                return 1;
            } else if (!b.dato) {
                return -1;
            }
            return compareDesc(new Date(a.dato), new Date(b.dato));
        })
        .map((dokument) => {
            return { ...dokument, dato: formaterNullableIsoDatoTid(dokument.dato) };
        });
};

export const lastNedDokument = (dokument: DokumentProps) => {
    åpneFilIEgenTab(
        dokument.journalpostId,
        dokument.dokumentinfoId,
        dokument.tittel || dokument.filnavn || ''
    );
};
