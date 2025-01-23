import * as React from 'react';

import { useNavigate } from 'react-router-dom';

import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';

export const VedtakFerdigstiltModal = ({
    visModal,
    lukkModal,
}: {
    visModal: boolean;
    lukkModal: () => void;
}) => {
    const navigate = useNavigate();

    return (
        <ModalWrapper
            tittel={'Vedtaket er ferdigstilt'}
            visModal={visModal}
            onClose={() => lukkModal()}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => navigate('/'),
                    tekst: 'Til oppgavebenk',
                },
                lukkKnapp: {
                    onClick: () => lukkModal(),
                    tekst: 'Lukk',
                },
            }}
        />
    );
};
