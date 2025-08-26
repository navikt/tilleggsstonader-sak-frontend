import React from 'react';

import { Box } from '@navikt/ds-react';

import { PanelHeader, PanelHeaderType } from './PanelHeader';
import { JournalpostResponse } from '../../../typer/journalpost';

interface Props {
    journalpostResponse: JournalpostResponse;
}

const BrukerPanel: React.FC<Props> = ({ journalpostResponse }) => {
    const { navn, personIdent } = journalpostResponse;

    return (
        <Box padding="4" borderWidth="1" borderRadius="small">
            <PanelHeader navn={navn} personIdent={personIdent} type={PanelHeaderType.Bruker} />
        </Box>
    );
};

export default BrukerPanel;
