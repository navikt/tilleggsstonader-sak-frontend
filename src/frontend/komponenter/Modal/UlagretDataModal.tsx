import React, { FC } from 'react';

import ReactRouterPrompt from 'react-router-prompt';

import { ModalWrapper } from './ModalWrapper';
import { useApp } from '../../context/AppContext';

const UlagretDataModal: FC = () => {
    const { nullstillIkkePersisterteKomponenter, harUlagretData } = useApp();

    return (
        <ReactRouterPrompt when={harUlagretData}>
            {({ isActive, onConfirm, onCancel }) => (
                <ModalWrapper
                    tittel={
                        'Du har ikke lagret dine siste endringer og vil miste disse om du forlater siden'
                    }
                    visModal={isActive}
                    onClose={onCancel}
                    aksjonsknapper={{
                        hovedKnapp: {
                            onClick: onCancel,
                            tekst: 'Gå tilbake for å lagre',
                        },
                        lukkKnapp: {
                            onClick: () => {
                                onConfirm();
                                setTimeout(nullstillIkkePersisterteKomponenter, 10);
                            },
                            tekst: 'Forlat siden',
                        },
                        marginTop: 4,
                    }}
                />
            )}
        </ReactRouterPrompt>
    );
};

export default UlagretDataModal;
