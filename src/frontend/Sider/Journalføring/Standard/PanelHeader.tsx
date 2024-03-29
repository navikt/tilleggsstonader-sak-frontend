import React from 'react';

import styled from 'styled-components';

import { EnvelopeClosedIcon, PersonCircleIcon } from '@navikt/aksel-icons';
import { CopyButton, HStack, Label } from '@navikt/ds-react';
import { ABlue500 } from '@navikt/ds-tokens/dist/tokens';

const IkonContainer = styled.div`
    color: ${ABlue500};
`;

export enum PanelHeaderType {
    Bruker,
    Avsender,
}
interface Props {
    navn: string;
    personIdent: string;
    type: PanelHeaderType;
}

export const PanelHeader: React.FC<Props> = ({ navn, personIdent, type }) => {
    const tittel = `${navn} - ${personIdent}`;

    return (
        <HStack gap="4">
            <IkonContainer>
                {type == PanelHeaderType.Bruker && <PersonCircleIcon fontSize={'3.5rem'} />}
                {type == PanelHeaderType.Avsender && <EnvelopeClosedIcon fontSize={'3.5rem'} />}
            </IkonContainer>
            <HStack align="center">
                <Label as={'p'}>{tittel}</Label>
                <CopyButton copyText={personIdent} variant="action" />
            </HStack>
        </HStack>
    );
};
