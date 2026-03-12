import React from 'react';

import { v4 as uuidv4 } from 'uuid';

import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Button, ExpansionCard, UNSAFE_Combobox } from '@navikt/ds-react';

import styles from './DokumentPanel.module.css';
import { DokumentPanelHeader } from './DokumentPanelHeader';
import { JournalføringState } from '../../../hooks/useJournalføringState';
import { DokumentInfoJournalpost } from '../../../typer/journalpost';
import { åpneFilIEgenTab } from '../../../utils/utils';
import { dokumentTitler as dokumentTittelAlternativer } from '../Felles/utils';

interface Props {
    journalpostState: JournalføringState;
    dokument: DokumentInfoJournalpost;
}

export const DokumentPanel: React.FC<Props> = ({ journalpostState, dokument }) => {
    const {
        dokumentTitler,
        logiskeVedleggPåDokument,
        settDokumentTitler,
        settLogiskeVedleggPåDokument,
        settValgtDokumentPanel,
        valgtDokumentPanel,
        journalpost,
    } = journalpostState;

    const endreDokumentNavn = (dokumentInfoId: string, nyttDokumentNavn: string) => {
        settDokumentTitler((prevState: Record<string, string> | undefined) => ({
            ...prevState,
            [dokumentInfoId]: nyttDokumentNavn,
        }));
    };

    const endreLogiskeVedlegg = (dokumentInfoId: string, nyeLogiskeVedlegg: string[]) => {
        settLogiskeVedleggPåDokument((prevState) => ({
            ...prevState,
            [dokumentInfoId]: nyeLogiskeVedlegg.map((tittel) => {
                return { logiskVedleggId: uuidv4(), tittel: tittel };
            }),
        }));
    };

    const dokumentPanelErValgt = valgtDokumentPanel === dokument.dokumentInfoId;
    const dokumentTittel =
        (dokumentTitler && dokumentTitler[dokument.dokumentInfoId]) ||
        dokument.tittel ||
        'Ukjent dokumenttittel';
    const valgtDokumentTittel = dokumentTittel ? [dokumentTittel] : [];

    const logiskeVedlegg = logiskeVedleggPåDokument
        ? (logiskeVedleggPåDokument[dokument.dokumentInfoId] ?? [])
        : [];
    const valgteLogiskeVedlegg = logiskeVedlegg.map(({ tittel }) => tittel);

    return (
        <ExpansionCard
            id={dokument.dokumentInfoId}
            size="small"
            aria-label="journalpost"
            onToggle={() => {
                if (!dokumentPanelErValgt) {
                    settValgtDokumentPanel(dokument.dokumentInfoId);
                }
            }}
        >
            <ExpansionCard.Header className={styles.expansionCardHeader}>
                <DokumentPanelHeader
                    dokumentTittel={dokumentTittel}
                    erValgt={dokumentPanelErValgt}
                    logiskeVedlegg={logiskeVedlegg}
                />
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                <div className={styles.expansionCardContent}>
                    <UNSAFE_Combobox
                        className={styles.multiSelect}
                        label="Dokumenttittel"
                        options={dokumentTittelAlternativer}
                        placeholder="Velg tittel"
                        selectedOptions={valgtDokumentTittel}
                        allowNewValues
                        size="small"
                        onToggleSelected={(nyTittel, erValgt) => {
                            endreDokumentNavn(dokument.dokumentInfoId, erValgt ? nyTittel : '');
                        }}
                    />
                    <UNSAFE_Combobox
                        className={styles.multiSelect}
                        label="Annet innhold"
                        options={dokumentTittelAlternativer}
                        placeholder="Velg innhold"
                        selectedOptions={valgteLogiskeVedlegg}
                        allowNewValues
                        isMultiSelect
                        size="small"
                        onToggleSelected={(verdi, erValgt) => {
                            const nyeLogiskeVedlegg = erValgt
                                ? Array.from(new Set([...valgteLogiskeVedlegg, verdi]))
                                : valgteLogiskeVedlegg.filter(
                                      (logiskVedlegg) => logiskVedlegg !== verdi
                                  );

                            endreLogiskeVedlegg(dokument.dokumentInfoId, nyeLogiskeVedlegg);
                        }}
                    />
                    <Button
                        className={styles.eksternLenkeKnapp}
                        type={'button'}
                        variant={'tertiary'}
                        size={'small'}
                        icon={<ExternalLinkIcon aria-hidden />}
                        iconPosition={'right'}
                        onClick={() =>
                            åpneFilIEgenTab(
                                journalpost.journalpostId,
                                dokument.dokumentInfoId,
                                dokumentTittel
                            )
                        }
                    >
                        Åpne i ny fane
                    </Button>
                </div>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};
