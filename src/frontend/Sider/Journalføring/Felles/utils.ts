import { ISelectOption, MultiValue, PropsValue, SingleValue } from '@navikt/familie-form-elements';

import { Journalføringsaksjon } from '../../../hooks/useJournalføringState';
import { BehandlingForJournalføring } from '../../../typer/behandling/behandling';
import { BehandlingResultat } from '../../../typer/behandling/behandlingResultat';
import { BehandlingStatus } from '../../../typer/behandling/behandlingStatus';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { LogiskVedlegg } from '../../../typer/dokument';
import { Journalpost, JournalpostResponse } from '../../../typer/journalpost';
import { Behandlingstema } from '../../Oppgavebenk/typer/oppgave';
import { Journalføringsårsak } from '../typer/journalføringsårsak';

export type MultiSelectValue = { label: string; value: string };

export const dokumentTitler: string[] = [
    'Anke',
    'Bekreftelse på barns plass i barnehage / skolefritidsordning',
    'Bekreftelse på samling',
    'Bekreftelse på særskilte behov for flere hjemreiser',
    'Bekreftelse på utdanning',
    'Bostedsbevis',
    'Dokumentasjon av innhentede tilbud',
    'Dokumentasjon av plass på kurs eller utdanning',
    'Dokumentasjon av reiseutgifter',
    'Dokumentasjon av utgifter knyttet til bruk av egen bil',
    'Dokumentasjon av utgifter',
    'Dokumentasjon av årsak til reise/flytting',
    'Dokumentasjon boutgifter',
    'Dokumentasjon enslig forsørger',
    'Dokumentasjon flytteårsak/utgifter',
    'Dokumentasjon gjenlevende ektefelle',
    'Dokumentasjon på behov for tilsyn',
    'Dokumentasjon tidligere familiepleier',
    'Faktura',
    'Forespørsel',
    'Institusjonsopphold',
    'Kjøreliste for godkjent bruk av egen bil',
    'Klage',
    'Krav om gjenopptak av ankesak',
    'Medisinske opplysninger',
    'Merknader i ankesak',
    'Merknader i klagesak',
    'Oppholdsopplysninger',
    'Refusjon reisetilskudd',
    'Refusjonskrav',
    'Rettsavgjørelse',
    'Stevning',
    'Søknad om tilleggsstønad',
    'Uttalelse',
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

export const valgbareStønadstyper = [
    Stønadstype.BARNETILSYN,
    Stønadstype.LÆREMIDLER,
    Stønadstype.BOUTGIFTER,
];

export const valgbareJournalføringsårsaker = (årsak: Journalføringsårsak) => [
    Journalføringsårsak.IKKE_VALGT,
    Journalføringsårsak.ETTERSENDING,
    årsak === Journalføringsårsak.KLAGE_TILBAKEKREVING
        ? Journalføringsårsak.KLAGE_TILBAKEKREVING
        : Journalføringsårsak.KLAGE,
    Journalføringsårsak.PAPIRSØKNAD,
];

export const alleBehandlingerErFerdigstiltEllerSattPåVent = (
    behandlinger: BehandlingForJournalføring[]
) =>
    behandlinger.every(
        (behandling) =>
            behandling.status === BehandlingStatus.FERDIGSTILT ||
            (behandling.status === BehandlingStatus.SATT_PÅ_VENT &&
                behandling.type === BehandlingType.REVURDERING)
    );

export const utledBehandlingstype = (
    tidligereBehandlinger: BehandlingForJournalføring[],
    journalføringsårsak: Journalføringsårsak
): BehandlingType => {
    if (
        [Journalføringsårsak.KLAGE, Journalføringsårsak.KLAGE_TILBAKEKREVING].includes(
            journalføringsårsak
        )
    ) {
        return BehandlingType.KLAGE;
    }
    const harIverksattTidligereBehandlinger = tidligereBehandlinger.some(
        (tidligereBehandling) => tidligereBehandling.resultat !== BehandlingResultat.HENLAGT
    );

    return harIverksattTidligereBehandlinger
        ? BehandlingType.REVURDERING
        : BehandlingType.FØRSTEGANGSBEHANDLING;
};

export const skalViseBekreftelsesmodal = (
    journalResponse: JournalpostResponse,
    journalføringsaksjon: Journalføringsaksjon,
    erPapirSøknad: boolean,
    erKlage: boolean
) =>
    journalføringsaksjon === Journalføringsaksjon.OPPRETT_BEHANDLING
        ? false
        : journalResponse.harStrukturertSøknad || erPapirSøknad || erKlage;

export const journalføringsÅrsakErKlage = (journalføringsårsak: Journalføringsårsak): boolean =>
    journalføringsårsak === Journalføringsårsak.KLAGE ||
    journalføringsårsak === Journalføringsårsak.KLAGE_TILBAKEKREVING;

export const journalpostTilStønadstype = (journalpost: Journalpost): Stønadstype | undefined => {
    return (
        behandlingstemaTilStønadstype(journalpost.behandlingstema) ??
        stønadstypeFraBrevkode(journalpost)
    );
};

const behandlingstemaTilStønadstype = (
    behandlingstema: Behandlingstema | undefined
): Stønadstype | undefined => {
    switch (behandlingstema) {
        case 'ab0300':
            return Stønadstype.BARNETILSYN;
        case 'ab0292':
            return Stønadstype.LÆREMIDLER;
        case 'ab0286': // Se [stønadstypeFraBrevkode]
            return Stønadstype.BOUTGIFTER;
        case 'ab0287':
            return Stønadstype.DAGLIG_REISE_TSR;
        case 'ab0288':
            return Stønadstype.DAGLIG_REISE_TSO;
        default:
            return undefined;
    }
};

/**
 * FyllUt/SendInn som arkiverer søknad for boutgifter setter ikke behandlingstema på journalposten
 * Av den grunnen må vi sjekke om det finnes en dokument med brevkode NAV 11-12.19 for å vite at det gjelder boutgifter
 * Hvis ikke får man ikke journalført journalposten på stønadstype boutgifter
 */
const stønadstypeFraBrevkode = (journalpost: Journalpost): Stønadstype | undefined => {
    if (journalpost.dokumenter.some((dokument) => dokument.brevkode === 'NAV 11-12.19')) {
        return Stønadstype.BOUTGIFTER;
    }
    if (journalpost.dokumenter.some((dokument) => dokument.brevkode === 'NAV 11-12.21')) {
        return Stønadstype.DAGLIG_REISE_TSO;
    }
    // TODO: Vi trenger en håndtering av daglig reise TSR også etter hvert

    return undefined;
};
