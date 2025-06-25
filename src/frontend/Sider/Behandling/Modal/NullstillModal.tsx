import React, { useState } from 'react';

import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { Feil, feiletRessursTilFeilmelding } from '../../../komponenter/Feil/feilmeldingUtils';
import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';
import { RessursStatus } from '../../../typer/ressurs';

const NullstillModal: React.FC = () => {
    const { request } = useApp();

    const { behandling, visNullstillModal, settVisNullstillModal } = useBehandling();

    const [laster, settLaster] = useState(false);
    const [feilmelding, settFeilmelding] = useState<Feil>();

    const lukkModal = () => {
        settFeilmelding(undefined);
        settVisNullstillModal(false);
    };

    const nullstillBehandling = () => {
        if (laster) return;

        settLaster(true);

        request<null, null>(`/api/sak/behandling/${behandling.id}/nullstill`, 'POST')
            .then((respons) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    lukkModal();
                    // TODO bør kunne løses bedre ved å kun refreshe state
                    window.location.reload();
                } else {
                    settFeilmelding(feiletRessursTilFeilmelding(respons));
                }
            })
            .finally(() => settLaster(false));
    };

    return (
        <ModalWrapper
            visModal={visNullstillModal}
            onClose={lukkModal}
            tittel={'Nullstill behandling'}
            ariaLabel={'Nullstill behandling'}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: nullstillBehandling,
                    tekst: 'Nullstill',
                    disabled: laster,
                    spinner: laster,
                },
                lukkKnapp: { onClick: () => lukkModal(), tekst: 'Avbryt' },
            }}
        >
            Nullstiller du behandlingen vil alle endringer blit fjernet.
            <Feilmelding feil={feilmelding} />
        </ModalWrapper>
    );
};

export default NullstillModal;
