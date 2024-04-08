import { ISelectOption, MultiValue, PropsValue, SingleValue } from '@navikt/familie-form-elements';

import { Journalføringsaksjon } from '../../../hooks/useJournalføringState';
import { Behandling } from '../../../typer/behandling/behandling';
import { BehandlingResultat } from '../../../typer/behandling/behandlingResultat';
import { BehandlingStatus } from '../../../typer/behandling/behandlingStatus';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { LogiskVedlegg } from '../../../typer/dokument';
import { Fagsak } from '../../../typer/fagsak';
import { JournalpostResponse } from '../../../typer/journalpost';
import { Journalføringsårsak } from '../typer/journalføringsårsak';

export type MultiSelectValue = { label: string; value: string };

// TODO: Avklar hvilke titler som skal være med i denne listen
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
    'Søknad om støtte til pass av barn',
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

export const journalføringGjelderKlage = (journalføringsårsak: Journalføringsårsak) =>
    journalføringsårsak === Journalføringsårsak.KLAGE ||
    journalføringsårsak === Journalføringsårsak.KLAGE_TILBAKEKREVING;

export const utledNesteJournalføringsårsak = (prevState: Journalføringsårsak) =>
    prevState === Journalføringsårsak.KLAGE
        ? Journalføringsårsak.KLAGE_TILBAKEKREVING
        : Journalføringsårsak.KLAGE;

export const valgbareStønadstyper = [Stønadstype.BARNETILSYN];

export const valgbareJournalføringsårsaker = (årsak: Journalføringsårsak) => [
    Journalføringsårsak.IKKE_VALGT,
    Journalføringsårsak.ETTERSENDING,
    årsak === Journalføringsårsak.KLAGE_TILBAKEKREVING
        ? Journalføringsårsak.KLAGE_TILBAKEKREVING
        : Journalføringsårsak.KLAGE,
    Journalføringsårsak.PAPIRSØKNAD,
];

export const alleBehandlingerErFerdigstiltEllerSattPåVent = (fagsak: Fagsak) =>
    fagsak.behandlinger.every(
        (behandling) =>
            behandling.status === BehandlingStatus.FERDIGSTILT ||
            (behandling.status === BehandlingStatus.SATT_PÅ_VENT &&
                behandling.type === BehandlingType.REVURDERING)
    );

export const utledBehandlingstype = (tidligereBehandlinger: Behandling[]): BehandlingType => {
    const harIverksattTidligereBehandlinger = tidligereBehandlinger.some(
        (tidligereBehandling) => tidligereBehandling.resultat !== BehandlingResultat.HENLAGT
    );

    return harIverksattTidligereBehandlinger
        ? BehandlingType.REVURDERING
        : BehandlingType.FØRSTEGANGSBEHANDLING;
};

export const behandlingerNyesteFørst = (
    stønadstype: Stønadstype | undefined,
    behandlinger: Behandling[]
) => (stønadstype && behandlinger.length > 0 ? behandlinger.slice().reverse() : []);

export const skalViseBekreftelsesmodal = (
    journalResponse: JournalpostResponse,
    journalføringsaksjon: Journalføringsaksjon,
    erPapirSøknad: boolean,
    erKlage: boolean
) =>
    journalføringsaksjon === Journalføringsaksjon.OPPRETT_BEHANDLING
        ? false
        : journalResponse.harStrukturertSøknad || erPapirSøknad || erKlage;
