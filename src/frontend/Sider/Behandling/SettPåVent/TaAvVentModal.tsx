import React, { useState } from 'react';

import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';
import { useApp } from '../../../context/AppContext';
import { RessursStatus } from '../../../typer/ressurs';
import { useBehandling } from '../../../context/BehandlingContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';

const TaAvVentModal: React.FC<{
    visModal: boolean;
    skjulModal: () => void;
}> = ({ visModal, skjulModal }) => {
    const { request } = useApp();
    const { behandling, hentBehandling } = useBehandling();

    const [feilmelding, settFeilmelding] = useState('');
    const [laster, settLaster] = useState(false);

    const taAvVent = () => {
        if (laster) return;
        settLaster(true);
        request<null, null>(`/api/sak/sett-pa-vent/${behandling.id}`, 'DELETE').then((resp) => {
            if (resp.status === RessursStatus.SUKSESS) {
                hentBehandling.rerun();
            } else {
                settFeilmelding(resp.frontendFeilmelding);
            }
        });
    };

    const lukkModal = () => {
        skjulModal();
        settLaster(false);
    };

    return (
        <ModalWrapper
            visModal={visModal}
            onClose={lukkModal}
            tittel="Ta behandling av vent"
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: taAvVent,
                    tekst: 'Tildel meg og start behandling',
                },
                lukkKnapp: {
                    onClick: lukkModal,
                    tekst: 'Angre',
                },
            }}
        >
            <Feilmelding variant="alert">{feilmelding}</Feilmelding>
        </ModalWrapper>
    );
};

export default TaAvVentModal;
