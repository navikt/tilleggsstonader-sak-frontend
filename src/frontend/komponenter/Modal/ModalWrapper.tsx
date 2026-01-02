import React from 'react';

import { Button, Modal } from '@navikt/ds-react';

import styles from './ModalWrapper.module.css';
import { sendHendelseTilUmami, UmamiHendelse } from '../../utils/umami/umami';

interface ModalProps {
    tittel?: string;
    visModal: boolean;
    onClose?: () => void;
    aksjonsknapper?: {
        hovedKnapp: Aksjonsknapp;
        lukkKnapp?: Aksjonsknapp;
        sekundærKnapp?: Aksjonsknapp;
    };
    maxWidth?: number;
    ariaLabel?: string;
    children?: React.ReactNode;
    umamiId: string;
}

interface Aksjonsknapp {
    onClick: () => void;
    tekst: string;
    disabled?: boolean;
    spinner?: boolean;
}

export const ModalWrapper: React.FC<ModalProps> = ({
    tittel,
    visModal,
    onClose,
    aksjonsknapper,
    maxWidth,
    ariaLabel,
    umamiId,
    children,
}) => {
    const umamiData = {
        modalId: umamiId,
        tittel: tittel,
    };

    const sendModalÅpnetTilUmami = () => {
        sendHendelseTilUmami(UmamiHendelse.MODAL_ÅPNET, umamiData);
    };

    const sendModalLukketTilUmami = (
        lukkMetode: 'hovedKnapp' | 'sekundærKnapp' | 'lukkKnapp' | 'kryssKnapp'
    ) => {
        sendHendelseTilUmami(UmamiHendelse.MODAL_LUKKET, { ...umamiData, lukkMetode: lukkMetode });
    };

    const håndterOnClose = () => {
        if (onClose) {
            sendModalLukketTilUmami('kryssKnapp');
            onClose();
        }
    };

    if (visModal) {
        sendModalÅpnetTilUmami();
    }
    return (
        visModal && (
            <Modal
                className={styles.modalContainer}
                style={
                    {
                        '--max-width': maxWidth ? `${maxWidth}rem` : '40rem',
                    } as React.CSSProperties
                }
                open={visModal}
                onClose={håndterOnClose}
                aria-label={ariaLabel ? ariaLabel : tittel || ''}
                header={tittel ? { heading: tittel, closeButton: !!onClose } : undefined}
            >
                <Modal.Body>{children}</Modal.Body>
                {aksjonsknapper && (
                    <Modal.Footer>
                        <Button
                            variant="primary"
                            type={'button'} // For å unngå at man trigger submit i skjema
                            onClick={() => {
                                sendModalLukketTilUmami('hovedKnapp');
                                aksjonsknapper.hovedKnapp.onClick();
                            }}
                            disabled={aksjonsknapper.hovedKnapp.disabled}
                            loading={aksjonsknapper.hovedKnapp.spinner}
                            size="small"
                        >
                            {aksjonsknapper.hovedKnapp.tekst}
                        </Button>
                        {aksjonsknapper.sekundærKnapp && (
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    sendModalLukketTilUmami('sekundærKnapp');
                                    aksjonsknapper.sekundærKnapp?.onClick();
                                }}
                                disabled={aksjonsknapper.sekundærKnapp.disabled}
                                loading={aksjonsknapper.sekundærKnapp.spinner}
                                size="small"
                            >
                                {aksjonsknapper.sekundærKnapp.tekst}
                            </Button>
                        )}
                        {aksjonsknapper.lukkKnapp && (
                            <Button
                                variant="tertiary"
                                onClick={() => {
                                    sendModalLukketTilUmami('lukkKnapp');
                                    aksjonsknapper.lukkKnapp?.onClick();
                                }}
                                disabled={aksjonsknapper.lukkKnapp.disabled}
                                loading={aksjonsknapper.lukkKnapp.spinner}
                                size="small"
                            >
                                {aksjonsknapper.lukkKnapp.tekst}
                            </Button>
                        )}
                    </Modal.Footer>
                )}
            </Modal>
        )
    );
};
