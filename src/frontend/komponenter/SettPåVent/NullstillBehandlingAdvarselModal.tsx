import React from 'react';

import { BodyLong } from '@navikt/ds-react';

import { ModalWrapper } from '../Modal/ModalWrapper';

interface Props {
    settVisTaAvVentModal: (verdi: boolean) => void;
    settVisNullstillBehandlingAdvarselModal: (verdi: boolean) => void;
}

export function NullstillBehandlingAdvarselModal({
    settVisNullstillBehandlingAdvarselModal,
    settVisTaAvVentModal,
}: Props) {
    return (
        <ModalWrapper
            visModal={true}
            tittel="Behandlingen nullstilles!"
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => {
                        settVisNullstillBehandlingAdvarselModal(false);
                        settVisTaAvVentModal(true);
                    },
                    tekst: 'Det er ok - nullstill behandling',
                },
                lukkKnapp: {
                    onClick: () => {
                        settVisNullstillBehandlingAdvarselModal(false);
                        settVisTaAvVentModal(false);
                    },
                    tekst: 'Avbryt',
                },
            }}
        >
            <BodyLong spacing>
                Ettersom det har blitt fattet et annet vedtak på denne fagsaken i tidsrommet denne
                behandlingen har vært på vent, er vi nødt til å tilbakestille eventuelle endringer
                som er gjort i denne behandlingen. Dette er fordi det forrige vedtaket kan påvirke
                behandlingen.
            </BodyLong>
            <BodyLong>
                Hvis du har lagt inn informasjon som du ønsker å ha med videre, må du velge
                &quot;Avbryt&quot;. Deretter kopierer du det du vil ta vare på før behandlingen tas
                av vent.
            </BodyLong>
        </ModalWrapper>
    );
}
