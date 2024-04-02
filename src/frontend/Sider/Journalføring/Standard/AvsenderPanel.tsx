import React, { useState } from 'react';

import styled from 'styled-components';

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
import { ABlue500 } from '@navikt/ds-tokens/dist/tokens';

import { PanelHeader, PanelHeaderType } from './PanelHeader';
import { JournalføringState } from '../../../hooks/useJournalføringState';
import { JournalpostResponse } from '../../../typer/journalpost';

const ExpansionCardHeader = styled(ExpansionCard.Header)`
    padding-bottom: 0.35rem;
`;

const ExpansionCardContent = styled(VStack).attrs({ gap: '4' })`
    padding-bottom: 1rem;
`;

const IkonContainer = styled.div`
    color: ${ABlue500};
`;

const KopierPersonIdent = styled(CopyButton)`
    z-index: 2;
`;

interface Props {
    journalpostResponse: JournalpostResponse;
    journalpostState: JournalføringState;
}

const AvsenderPanel: React.FC<Props> = ({ journalpostResponse, journalpostState }) => {
    const { journalpost, navn, personIdent } = journalpostResponse;
    const { nyAvsender, settNyAvsender } = journalpostState;
    const { journalpostId, avsenderMottaker } = journalpost;

    const [erPanelEkspandert, settErPanelEkspandert] = useState<boolean>(true);

    const harAvsender =
        !!avsenderMottaker && !!avsenderMottaker.navn && !!avsenderMottaker.id && false;
    const erBrukerAvsender = !!nyAvsender?.erBruker;

    return (
        <>
            {harAvsender ? (
                <Box padding="4" borderWidth="1" borderRadius="small" borderColor="border-default">
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
                    <ExpansionCardHeader>
                        <HStack gap="4">
                            <IkonContainer>
                                {erPanelEkspandert ? (
                                    <EnvelopeClosedFillIcon fontSize={'3.5rem'} />
                                ) : (
                                    <EnvelopeClosedIcon fontSize={'3.5rem'} />
                                )}
                            </IkonContainer>
                            <HStack align="center">
                                {erBrukerAvsender ? (
                                    <>
                                        <Label as={'p'}>{`${navn} - ${personIdent}`}</Label>
                                        <KopierPersonIdent
                                            copyText={personIdent}
                                            variant="action"
                                        />
                                    </>
                                ) : (
                                    <Label as={'p'}>{nyAvsender?.navn ?? 'Ukjent avsender'}</Label>
                                )}
                            </HStack>
                        </HStack>
                    </ExpansionCardHeader>
                    <ExpansionCard.Content>
                        <ExpansionCardContent>
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
                            />
                        </ExpansionCardContent>
                    </ExpansionCard.Content>
                </ExpansionCard>
            )}
        </>
    );
};

export default AvsenderPanel;
