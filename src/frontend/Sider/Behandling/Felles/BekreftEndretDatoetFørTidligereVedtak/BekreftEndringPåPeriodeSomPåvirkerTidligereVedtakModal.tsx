import React from 'react';

import { Alert } from '@navikt/ds-react';

import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';

export const BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal = ({
    visBekreftModal,
    settVisBekreftModal,
    bekreftLagre,
    laster,
}: {
    visBekreftModal: boolean;
    settVisBekreftModal: (verdi: boolean) => void;
    bekreftLagre: () => void;
    laster: boolean;
}) => {
    return (
        <ModalWrapper
            visModal={visBekreftModal}
            tittel={'Endring av periode som kanskje påvirker tidligere vedtak'}
            onClose={() => settVisBekreftModal(false)}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => {
                        bekreftLagre();
                    },
                    tekst: 'Bekreft',
                    disabled: laster,
                    spinner: laster,
                },
                lukkKnapp: {
                    onClick: () => settVisBekreftModal(false),
                    tekst: 'Avbryt',
                    disabled: false,
                    spinner: false,
                },
            }}
        >
            {/* en bedre feilmelding */}
            <Alert variant={'warning'}>
                Du gjør nå en endring tilbake i tid, som kan påvirke beregningen og tidligere
                innvilget vedtak. Er du sikker på at du ønsker dette?
            </Alert>
        </ModalWrapper>
    );
};
