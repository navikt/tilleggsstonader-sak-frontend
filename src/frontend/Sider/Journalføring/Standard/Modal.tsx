import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { JournalføringState } from '../../../hooks/useJournalføringState';
import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';
import { RessursStatus } from '../../../typer/ressurs';

export const BekreftJournalføringModal: React.FC<{
    journalpostState: JournalføringState;
}> = ({ journalpostState }) => {
    const senderInn = journalpostState.innsending.status == RessursStatus.HENTER;
    return (
        <ModalWrapper
            tittel={'Journalfør uten behandling'}
            umamiId={'journalfør-uten-behandling'}
            visModal={journalpostState.visBekreftelsesModal}
            onClose={() => journalpostState.settVisBekreftelsesModal(false)}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => {
                        journalpostState.settVisBekreftelsesModal(false);
                        journalpostState.fullførJournalføring();
                    },
                    disabled: senderInn,
                    tekst: 'Journalfør allikevel',
                },
                lukkKnapp: {
                    onClick: () => journalpostState.settVisBekreftelsesModal(false),
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
