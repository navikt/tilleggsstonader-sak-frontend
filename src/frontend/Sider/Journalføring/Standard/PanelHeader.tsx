import React from 'react';

import { EnvelopeClosedIcon, PersonCircleIcon } from '@navikt/aksel-icons';
import { CopyButton, HStack, Label } from '@navikt/ds-react';

import styles from './PanelHeader.module.css';

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
        <HStack gap="space-16">
            <div className={styles.ikonContainer}>
                {type == PanelHeaderType.Bruker && <PersonCircleIcon fontSize={'3.5rem'} />}
                {type == PanelHeaderType.Avsender && <EnvelopeClosedIcon fontSize={'3.5rem'} />}
            </div>
            <HStack align="center">
                <Label as={'p'}>{tittel}</Label>
                <CopyButton copyText={personIdent} variant="action" />
            </HStack>
        </HStack>
    );
};
