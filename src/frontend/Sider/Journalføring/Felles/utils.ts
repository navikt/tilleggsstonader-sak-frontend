import { ISelectOption, MultiValue, PropsValue, SingleValue } from '@navikt/familie-form-elements';

import { LogiskVedlegg } from '../../../typer/dokument';

export type MultiSelectValue = { label: string; value: string };

export const dokumentTitler: string[] = [
    'Anke på tilbakekreving',
    'Arbeidsforhold',
    'Avtale / Avgjørelse om samvær',
    'Bekreftelse fra barnevernet',
    'Bekreftelse på termindato',
    'Bekreftelse på tilsynsutgifter',
    'Bekreftelse på utdanning / utgifter',
    'Endring i sivilstand',
    'Enslig mor eller far som er arbeidssøker',
    'Eklæring om samlivsbrudd',
    'EØS dokument',
    'Forespørsel',
    'Fødselsmelding/Fødselsattest',
    'Grunnblankett',
    'Inntektsopplysninger',
    'Klage på tilbakekreving',
    'Klage/Anke',
    'Krav om gjenopptak av ankesak',
    'Medisinsk dokumentasjon',
    'Merknader i ankesak',
    'Oppholdstillatelse',
    'Refusjonskrav/faktura',
    'Rettsavgjørelse',
    'Skatteopplysninger',
    'Stevning',
    'Søknad om overgangsstønad',
    'Søknad om skolepenger',
    'Søknad om barnetilsyn',
    'Tilmelding til NAV som reell arbeidssøker ved krav om overgangsstønad',
    'Uttalelse',
    'Uttalelse tilbakekreving',
];

export const dokumentTitlerMultiSelect: ISelectOption[] = dokumentTitler.map((tittel) => {
    return { value: tittel, label: tittel };
});

export const mapDokumentTittelTilMultiselectValue = (tittel: string) => {
    return { value: tittel, label: tittel };
};

export const mapLogiskeVedleggTilMultiselectValue = (
    logiskeVedlegg: LogiskVedlegg[]
): PropsValue<{ label: string; value: string }> => {
    return logiskeVedlegg.map((vedlegg) => {
        return { label: vedlegg.tittel, value: vedlegg.tittel };
    });
};

export const mapMultiselectValueTilLogiskeVedlegg = (
    values: MultiValue<MultiSelectValue> | SingleValue<MultiSelectValue>
) => {
    if ((values as MultiValue<MultiSelectValue>).length !== undefined) {
        return (values as MultiValue<MultiSelectValue>).map((value) => value.value);
    } else {
        const value = values as SingleValue<MultiSelectValue>;
        return [value === null ? '' : value.value];
    }
};

export enum Journalføringsårsak {
    DIGITAL_SØKNAD = 'DIGITAL_SØKNAD',
    ETTERSENDING = 'ETTERSENDING',
    IKKE_VALGT = 'IKKE_VALGT',
    KLAGE = 'KLAGE',
    KLAGE_TILBAKEKREVING = 'KLAGE_TILBAKEKREVING',
    PAPIRSØKNAD = 'PAPIRSØKNAD',
}
