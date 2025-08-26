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
        sendHendelseTilUmami(
            UmamiHendelse.VIS_BEKREFT_ENDRING_SOM_PÅVIRKER_TIDLIGERE_VEDTAK_MODAL,
            { skalVises: visBekreftModal }
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
