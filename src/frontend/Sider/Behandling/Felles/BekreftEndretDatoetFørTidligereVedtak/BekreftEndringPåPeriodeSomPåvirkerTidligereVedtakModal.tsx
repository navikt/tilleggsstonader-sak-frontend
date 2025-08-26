import React from 'react';

import { Alert } from '@navikt/ds-react';

import { useBehandling } from '../../../../context/BehandlingContext';
import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';
import { formaterDato } from '../../../../utils/dato';
import { sendHendelseTilUmami } from '../../../../utils/umami/umami';

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
    const { sluttDatoForrigeVedtak } = useBehandling();
    if (visBekreftModal) {
        sendHendelseTilUmami(
            'vis bekreft endring på periode som påviker tidligere vedtak modal',
            {}
        );
    }
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
                    tekst: 'Fortsett',
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
            <Alert variant={'warning'}>
                Du gjør nå endring før {formaterDato(sluttDatoForrigeVedtak.sluttdato)} (sluttdato
                for forrige vedtak) som kan påvirke beregningen og tidligere innvilget vedtak.
            </Alert>
        </ModalWrapper>
    );
};
