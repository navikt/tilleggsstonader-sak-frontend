import React from 'react';

import { Alert } from '@navikt/ds-react';

import { useBehandling } from '../../../../context/BehandlingContext';
import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';
import { formaterDato } from '../../../../utils/dato';
import { sendHendelseTilUmami, UmamiHendelse } from '../../../../utils/umami/umami';

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
        sendHendelseTilUmami(UmamiHendelse.MODAL_ÅPNET, {
            modalId: 'bekreft-endring-av-tidligere-periode',
            tittel: 'Endring av periode som kan påvirke tidligere vedtak',
        });
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
                        sendHendelseTilUmami(UmamiHendelse.MODAL_LUKKET, {
                            modalId: 'bekreft-endring-av-tidligere-periode',
                            tittel: 'Endring av periode som kan påvirke tidligere vedtak',
                            lukkMetode: 'Fortsett',
                        });
                    },
                    tekst: 'Fortsett',
                    disabled: laster,
                    spinner: laster,
                },
                lukkKnapp: {
                    onClick: () => {
                        settVisBekreftModal(false);
                        sendHendelseTilUmami(UmamiHendelse.MODAL_LUKKET, {
                            modalId: 'bekreft-endring-av-tidligere-periode',
                            tittel: 'Endring av periode som kan påvirke tidligere vedtak',
                            lukkMetode: 'Avbryt',
                        });
                    },
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
