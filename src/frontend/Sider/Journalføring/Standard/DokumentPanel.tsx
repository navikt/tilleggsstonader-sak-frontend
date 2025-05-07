import React from 'react';

import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Button, ExpansionCard } from '@navikt/ds-react';
import { FamilieReactSelect, ISelectOption } from '@navikt/familie-form-elements';

import { DokumentPanelHeader } from './DokumentPanelHeader';
import { JournalføringState } from '../../../hooks/useJournalføringState';
import { DokumentInfoJournalpost } from '../../../typer/journalpost';
import { åpneFilIEgenTab } from '../../../utils/utils';
import {
    dokumentTitlerMultiSelect,
    mapDokumentTittelTilMultiselectValue,
    mapLogiskeVedleggTilMultiselectValue,
    mapMultiselectValueTilLogiskeVedlegg,
} from '../Felles/utils';

const ExpansionCardHeader = styled(ExpansionCard.Header)`
    padding-bottom: 0.35rem;
`;

const ExpansionCardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-bottom: 1rem;
`;

const EksternLenkeKnapp = styled(Button)`
    width: fit-content;
`;

const MultiSelect = styled(FamilieReactSelect)`
    margin-bottom: -1rem;
`;

interface Props {
    journalpostState: JournalføringState;
    dokument: DokumentInfoJournalpost;
}

const DokumentPanel: React.FC<Props> = ({ journalpostState, dokument }) => {
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
    const defaultTittelValue = dokumentTittel
        ? mapDokumentTittelTilMultiselectValue(dokumentTittel)
        : undefined;

    const logiskeVedlegg = logiskeVedleggPåDokument
        ? (logiskeVedleggPåDokument[dokument.dokumentInfoId] ?? [])
        : [];

    const defaultLogiskeVedleggValue = logiskeVedlegg
        ? mapLogiskeVedleggTilMultiselectValue(logiskeVedlegg)
        : undefined;

    // TODO: Når aksel sin combobox er ute av beta, bytt ut MultiSelect med den og fjern @navikt/familie-form-elements fra package.json
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
            <ExpansionCardHeader>
                <DokumentPanelHeader
                    dokumentTittel={dokumentTittel}
                    erValgt={dokumentPanelErValgt}
                    logiskeVedlegg={logiskeVedlegg}
                />
            </ExpansionCardHeader>
            <ExpansionCard.Content>
                <ExpansionCardContent>
                    <MultiSelect
                        placeholder={'Velg tittel'}
                        label={'Dokumenttittel'}
                        options={dokumentTitlerMultiSelect}
                        creatable={true}
                        menuPortalTarget={document.querySelector('body')}
                        isMulti={false}
                        isDisabled={false}
                        defaultValue={defaultTittelValue}
                        feil={null}
                        onChange={(nyTittel) => {
                            endreDokumentNavn(
                                dokument.dokumentInfoId,
                                nyTittel ? (nyTittel as ISelectOption).value : ''
                            );
                        }}
                    />
                    <MultiSelect
                        placeholder={'Velg innhold'}
                        label={'Annet innhold'}
                        creatable={true}
                        options={dokumentTitlerMultiSelect}
                        menuPortalTarget={document.querySelector('body')}
                        isMulti={true}
                        isDisabled={false}
                        defaultValue={defaultLogiskeVedleggValue}
                        feil={null}
                        onChange={(values) => {
                            endreLogiskeVedlegg(
                                dokument.dokumentInfoId,
                                mapMultiselectValueTilLogiskeVedlegg(values)
                            );
                        }}
                    />
                    <EksternLenkeKnapp
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
                    </EksternLenkeKnapp>
                </ExpansionCardContent>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};

export default DokumentPanel;
