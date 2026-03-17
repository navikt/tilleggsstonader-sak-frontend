import { Journalføringsaksjon, JournalføringState } from '../../../hooks/useJournalføringState';
import { DokumentTitler } from '../../../typer/dokument';
import { JournalpostResponse } from '../../../typer/journalpost';
import { harIkkeVerdi } from '../../../utils/utils';
import { journalføringGjelderKlage } from '../Felles/utils';
import { Journalføringsårsak } from '../typer/journalføringsårsak';

export const validerJournalføring = (
    journalResponse: JournalpostResponse,
    journalføringState: JournalføringState
): string | undefined => {
    if (journalføringGjelderKlage(journalføringState.journalføringsårsak))
        return validerKlageJournalføring(journalResponse, journalføringState);
    return validerStandardJournalføring(journalResponse, journalføringState);
};

const validerKlageJournalføring = (
    journalResponse: JournalpostResponse,
    journalføringState: JournalføringState
): string | undefined => {
    const valideringsfeil = validerFellesFelter(journalResponse, journalføringState);

    if (valideringsfeil) return valideringsfeil;

    if (
        journalføringState.journalføringsaksjon === Journalføringsaksjon.OPPRETT_BEHANDLING &&
        !journalResponse.journalpost.datoMottatt
    )
        return 'Mangler gyldig mottatt dato';

    return undefined;
};

const validerStandardJournalføring = (
    journalResponse: JournalpostResponse,
    journalføringState: JournalføringState
): string | undefined => {
    const valideringsfeil = validerFellesFelter(journalResponse, journalføringState);

    if (valideringsfeil) return valideringsfeil;

    if (journalføringState.journalføringsaksjon === Journalføringsaksjon.OPPRETT_BEHANDLING) {
        return validerJournalføringTilNyBehandling(journalResponse, journalføringState);
    }

    return undefined;
};

const validerFellesFelter = (
    journalResponse: JournalpostResponse,
    journalføringState: JournalføringState
): string | undefined => {
    const { journalføringsårsak, stønadstype, dokumentTitler, nyAvsender } = journalføringState;

    if (journalføringsårsak === Journalføringsårsak.IKKE_VALGT)
        return 'Mangler journalføringsårsak (Type)';

    if (!stønadstype) return 'Mangler stønadstype';

    if (!harTittelForAlleDokumenter(journalResponse, dokumentTitler))
        return 'Mangler tittel på et eller flere dokumenter';

    if (journalResponse.journalpost.tema !== 'TSO')
        return 'Tema på journalføringsoppgaven må endres til «Tilleggsstønader» i Gosys før du kan journalføre dokumentet.';

    if (
        nyAvsender?.erBruker &&
        (harIkkeVerdi(nyAvsender.navn) || harIkkeVerdi(nyAvsender.personIdent))
    )
        return 'Kan ikke velge at ny avsender er bruker uten å sende inn verdier for navn og personident';

    if (nyAvsender?.erBruker === false && harIkkeVerdi(nyAvsender.navn))
        return 'Kan ikke sende inn uten avsender';

    return undefined;
};

const validerJournalføringTilNyBehandling = (
    journalResponse: JournalpostResponse,
    journalføringState: JournalføringState
) => {
    if (journalResponse.harStrukturertSøknad) {
        if (journalføringState.journalføringsårsak !== Journalføringsårsak.DIGITAL_SØKNAD)
            return 'Årsak til journalføring må være digital søknad siden det foreligger en digital søknad på journalposten';
    } else {
        if (journalføringState.journalføringsårsak === Journalføringsårsak.DIGITAL_SØKNAD)
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
