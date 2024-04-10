import { Journalføringsaksjon, JournalføringState } from '../../../hooks/useJournalføringState';
import { Behandling } from '../../../typer/behandling/behandling';
import { DokumentTitler } from '../../../typer/dokument';
import { JournalpostResponse } from '../../../typer/journalpost';
import {
    alleBehandlingerErFerdigstiltEllerSattPåVent,
    journalføringGjelderKlage,
} from '../Felles/utils';
import { Journalføringsårsak } from '../typer/journalføringsårsak';

export const validerJournalføring = (
    journalResponse: JournalpostResponse,
    journalpostState: JournalføringState,
    behandlinger: Behandling[]
): string | undefined => {
    if (journalføringGjelderKlage(journalpostState.journalføringsårsak))
        return validerKlageJournalføring(journalResponse, journalpostState);
    return validerStandardJournalføring(journalResponse, journalpostState, behandlinger);
};

const validerKlageJournalføring = (
    journalResponse: JournalpostResponse,
    journalpostState: JournalføringState
): string | undefined => {
    const valideringsfeil = validerFellesFelter(journalResponse, journalpostState);

    if (valideringsfeil) return valideringsfeil;

    if (
        journalpostState.journalføringsaksjon === Journalføringsaksjon.OPPRETT_BEHANDLING &&
        !journalResponse.journalpost.datoMottatt
    )
        return 'Mangler gyldig mottatt dato';

    return undefined;
};

const validerStandardJournalføring = (
    journalResponse: JournalpostResponse,
    journalpostState: JournalføringState,
    behandlinger: Behandling[]
): string | undefined => {
    const valideringsfeil = validerFellesFelter(journalResponse, journalpostState);

    if (valideringsfeil) return valideringsfeil;

    if (journalpostState.journalføringsaksjon === Journalføringsaksjon.OPPRETT_BEHANDLING) {
        return validerJournalføringTilNyBehandling(journalResponse, journalpostState, behandlinger);
    }

    return undefined;
};

const validerFellesFelter = (
    journalResponse: JournalpostResponse,
    journalpostState: JournalføringState
): string | undefined => {
    const { journalføringsårsak, stønadstype, dokumentTitler, nyAvsender } = journalpostState;

    if (journalføringsårsak === Journalføringsårsak.IKKE_VALGT)
        return 'Mangler journalføringsårsak (Type)';

    if (!stønadstype) return 'Mangler stønadstype';

    if (!harTittelForAlleDokumenter(journalResponse, dokumentTitler))
        return 'Mangler tittel på et eller flere dokumenter';

    if (journalResponse.journalpost.tema !== 'TSO')
        return 'Tema på journalføringsoppgaven må endres til «Tilleggsstønader» i Gosys før du kan journalføre dokumentet.';

    if (
        nyAvsender?.erBruker &&
        (nyAvsender.navn === undefined ||
            nyAvsender.navn === '' ||
            nyAvsender.personIdent === undefined ||
            nyAvsender.personIdent === '')
    )
        return 'Kan ikke velge at ny avsender er bruker uten å sende inn verdier for navn og personident';

    if (nyAvsender?.erBruker === false && (nyAvsender.navn === undefined || nyAvsender.navn === ''))
        return 'Kan ikke sende inn uten avsender';

    return undefined;
};

const validerJournalføringTilNyBehandling = (
    journalResponse: JournalpostResponse,
    journalpostState: JournalføringState,
    behandlinger: Behandling[]
) => {
    if (!alleBehandlingerErFerdigstiltEllerSattPåVent(behandlinger))
        return 'Kan ikke journalføre på ny behandling når det finnes en behandling som ikke er ferdigstilt';

    if (journalResponse.harStrukturertSøknad) {
        if (journalpostState.journalføringsårsak !== Journalføringsårsak.DIGITAL_SØKNAD)
            return 'Årsak til journalføring må være digital søknad siden det foreligger en digital søknad på journalposten';
    } else {
        if (journalpostState.journalføringsårsak === Journalføringsårsak.DIGITAL_SØKNAD)
            return 'Må velge mellom PAPIRSØKNAD, ETTERSENDING eller KLAGE når journalposten mangler en digital søknad';
    }

    return undefined;
};

const harTittelForAlleDokumenter = (
    journalResponse: JournalpostResponse,
    dokumentTitler?: DokumentTitler
) =>
    journalResponse.journalpost.dokumenter
        .map((d) => d.tittel || (dokumentTitler && dokumentTitler[d.dokumentInfoId]))
        .every((tittel) => tittel && tittel.trim());
