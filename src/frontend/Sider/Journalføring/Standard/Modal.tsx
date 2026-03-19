import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { JournalføringState } from '../../../hooks/useJournalføringState';
import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';
import { RessursStatus } from '../../../typer/ressurs';

export const BekreftJournalføringModal: React.FC<{
    journalføringState: JournalføringState;
}> = ({ journalføringState }) => {
    const senderInn = journalføringState.innsending.status == RessursStatus.HENTER;
    return (
        <ModalWrapper
            tittel={'Journalfør uten behandling'}
            umamiId={'journalfør-uten-behandling'}
            visModal={journalføringState.visBekreftelsesModal}
            onClose={() => journalføringState.settVisBekreftelsesModal(false)}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => {
                        journalføringState.settVisBekreftelsesModal(false);
                        journalføringState.fullførJournalføring();
                    },
                    disabled: senderInn,
                    tekst: 'Journalfør allikevel',
                },
                lukkKnapp: {
                    onClick: () => journalføringState.settVisBekreftelsesModal(false),
                    tekst: 'Tilbake',
                },
            }}
            ariaLabel={'Bekreft journalføring av oppgave, eller avbryt'}
        >
            <BodyShort>
                Journalposten har en søknad tilknyttet seg. Er du sikker på at du vil journalføre
                uten å lage en ny behandling?
            </BodyShort>
        </ModalWrapper>
    );
};
