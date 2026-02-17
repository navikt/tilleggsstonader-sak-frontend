import React, { useState } from 'react';

import { EnvelopeClosedFillIcon, EnvelopeClosedIcon } from '@navikt/aksel-icons';
import {
    Box,
    Checkbox,
    CopyButton,
    ExpansionCard,
    HStack,
    Label,
    TextField,
    VStack,
} from '@navikt/ds-react';

import styles from './AvsenderPanel.module.css';
import { PanelHeader, PanelHeaderType } from './PanelHeader';
import { JournalføringState } from '../../../hooks/useJournalføringState';
import { JournalpostResponse } from '../../../typer/journalpost';

interface Props {
    journalpostResponse: JournalpostResponse;
    journalpostState: JournalføringState;
}

const AvsenderPanel: React.FC<Props> = ({ journalpostResponse, journalpostState }) => {
    const { journalpost, navn, personIdent } = journalpostResponse;
    const { nyAvsender, settNyAvsender } = journalpostState;
    const { journalpostId, avsenderMottaker } = journalpost;

    const [erPanelEkspandert, settErPanelEkspandert] = useState<boolean>(true);

    const harAvsender = !!avsenderMottaker && !!avsenderMottaker.navn && !!avsenderMottaker.id;
    const erBrukerAvsender = !!nyAvsender?.erBruker;

    return (
        <>
            {harAvsender ? (
                <Box padding="space-16" borderWidth="1" borderRadius="0">
                    <PanelHeader
                        navn={avsenderMottaker?.navn || 'Ukjent navn'}
                        personIdent={avsenderMottaker?.id || 'Ukjent ident'}
                        type={PanelHeaderType.Avsender}
                    />
                </Box>
            ) : (
                <ExpansionCard
                    id={journalpostId}
                    size="small"
                    aria-label="journalpost"
                    defaultOpen={erPanelEkspandert}
                    onToggle={() => settErPanelEkspandert((prevState) => !prevState)}
                >
                    <ExpansionCard.Header className={styles.expansionCardHeader}>
                        <HStack gap="space-16">
                            <div className={styles.ikonContainer}>
                                {erPanelEkspandert ? (
                                    <EnvelopeClosedFillIcon fontSize={'3.5rem'} />
                                ) : (
                                    <EnvelopeClosedIcon fontSize={'3.5rem'} />
                                )}
                            </div>
                            <HStack align="center">
                                {erBrukerAvsender ? (
                                    <>
                                        <Label as={'p'}>{`${navn} - ${personIdent}`}</Label>
                                        <CopyButton
                                            className={styles.kopierPersonIdent}
                                            copyText={personIdent}
                                            variant="action"
                                        />
                                    </>
                                ) : (
                                    <Label as={'p'}>{nyAvsender?.navn ?? 'Ukjent avsender'}</Label>
                                )}
                            </HStack>
                        </HStack>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>
                        <VStack gap="space-16" className={styles.expansionCardContent}>
                            <Checkbox
                                onChange={(event) => {
                                    settNyAvsender({
                                        erBruker: event.target.checked,
                                        navn: navn,
                                        personIdent: personIdent,
                                    });
                                }}
                                value={erBrukerAvsender}
                                checked={erBrukerAvsender}
                            >
                                Avsender er bruker
                            </Checkbox>
                            <TextField
                                disabled={erBrukerAvsender}
                                label={'Navn'}
                                onChange={(event) => {
                                    settNyAvsender({ erBruker: false, navn: event.target.value });
                                }}
                                size={'small'}
                                value={nyAvsender?.navn || ''}
                                autoComplete="off"
                            />
                        </VStack>
                    </ExpansionCard.Content>
                </ExpansionCard>
            )}
        </>
    );
};

export default AvsenderPanel;
