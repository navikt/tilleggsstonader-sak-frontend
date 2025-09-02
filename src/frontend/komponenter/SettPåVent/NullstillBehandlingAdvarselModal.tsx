import React from 'react';

import { BodyLong } from '@navikt/ds-react';

import { ModalWrapper } from '../Modal/ModalWrapper';

interface Props {
    bekreftNullstilling: () => void;
    avbryt: () => void;
}

export function NullstillBehandlingAdvarselModal({ bekreftNullstilling, avbryt }: Props) {
    return (
        <ModalWrapper
            visModal={true}
            tittel="Behandlingen nullstilles!"
            umamiId={'behandlingen-nullstilles'}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: bekreftNullstilling,
                    tekst: 'Nullstill behandling',
                },
                lukkKnapp: {
                    onClick: avbryt,
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
