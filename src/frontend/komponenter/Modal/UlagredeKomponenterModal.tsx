import React, { FC } from 'react';

import ReactRouterPrompt from 'react-router-prompt';

import { ModalWrapper } from './ModalWrapper';
import { useApp } from '../../context/AppContext';

/**
 * Viser modal i tilfelle man prøver å navigere til en annen side når det finnes ulagrede komponenter.
 * Viser også en alert på engelsk hvis man prøver å lukke vinduet når det finnes ulagede komponenter.
 */
const UlagredeKomponenterModal: FC = () => {
    const { nullstillUlagredeKomponenter, harUlagradeKomponenter } = useApp();

    return (
        <ReactRouterPrompt when={harUlagradeKomponenter}>
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
                                // Hack fordi samtidighet ikke helt fungerer
                                // hvis man kaller nullstill direkte fjenes modalen før onConfirm blir kallet på eller noe slik
                                setTimeout(nullstillUlagredeKomponenter, 10);
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

export default UlagredeKomponenterModal;
