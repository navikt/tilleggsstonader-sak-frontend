import React from 'react';

import { Feilmelding } from '../../komponenter/Feil/Feilmelding';
import { ModalWrapper } from '../../komponenter/Modal/ModalWrapper';

export interface FeilmeldingHåndterOppgave {
    tittel: string;
    melding: string;
}

export const FeilmeldingHåndterOppgaveModal = ({
    feilmelding,
    hentOppgaver,
    nullstillFeilmelding,
}: {
    feilmelding: FeilmeldingHåndterOppgave | undefined;
    hentOppgaver: () => void;
    nullstillFeilmelding: () => void;
}) => {
    const lukkModal = nullstillFeilmelding;
    if (!feilmelding) {
        return null;
    }
    return (
        <ModalWrapper
            visModal={true}
            tittel={feilmelding.tittel}
            umamiId={'feilmelding-håndter-oppgave'}
            onClose={lukkModal}
            aksjonsknapper={{
                hovedKnapp: {
                    tekst: 'Hent oppgaver på nytt',
                    onClick: () => {
                        hentOppgaver();
                        lukkModal();
                    },
                },
                lukkKnapp: {
                    tekst: 'Avbryt',
                    onClick: lukkModal,
                },
            }}
        >
            <Feilmelding feil={feilmelding.melding} />
        </ModalWrapper>
    );
};
