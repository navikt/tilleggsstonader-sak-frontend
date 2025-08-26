import React from 'react';

import styled from 'styled-components';

import { Button, Modal } from '@navikt/ds-react';

import { sendHendelseTilUmami, UmamiHendelse } from '../../utils/umami/umami';

const ModalContainer = styled(Modal)<{ $maxWidth?: number }>`
    min-width: 30rem;
    max-width: ${(props) => (props.$maxWidth ? `${props.$maxWidth}rem` : '40rem')};
`;

interface ModalProps {
    tittel?: string;
    visModal: boolean;
    onClose?: () => void;
    aksjonsknapper?: {
        hovedKnapp: Aksjonsknapp;
        lukkKnapp: Aksjonsknapp;
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
    if (visModal) {
        sendHendelseTilUmami(UmamiHendelse.MODAL_ÅPNET, {
            modalId: umamiId,
            tittel: tittel,
        });
    }
    return (
        visModal && (
            <ModalContainer
                open={visModal}
                onClose={onClose ? () => onClose() : () => null}
                $maxWidth={maxWidth}
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
                                sendHendelseTilUmami(UmamiHendelse.MODAL_LUKKET, {
                                    modalId: umamiId,
                                    tittel: tittel,
                                    lukkMetode: 'primary',
                                });
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
                                    sendHendelseTilUmami(UmamiHendelse.MODAL_LUKKET, {
                                        modalId: umamiId,
                                        tittel: tittel,
                                        lukkMetode: 'secondary',
                                    });
                                    aksjonsknapper.sekundærKnapp?.onClick();
                                }}
                                disabled={aksjonsknapper.sekundærKnapp.disabled}
                                loading={aksjonsknapper.sekundærKnapp.spinner}
                                size="small"
                            >
                                {aksjonsknapper.sekundærKnapp.tekst}
                            </Button>
                        )}
                        <Button
                            variant="tertiary"
                            onClick={() => {
                                sendHendelseTilUmami(UmamiHendelse.MODAL_LUKKET, {
                                    modalId: umamiId,
                                    tittel: tittel,
                                    lukkMetode: 'lukkKnapp',
                                });
                                aksjonsknapper.lukkKnapp?.onClick();
                            }}
                            disabled={aksjonsknapper.lukkKnapp.disabled}
                            loading={aksjonsknapper.lukkKnapp.spinner}
                            size="small"
                        >
                            {aksjonsknapper.lukkKnapp.tekst}
                        </Button>
                    </Modal.Footer>
                )}
            </ModalContainer>
        )
    );
};
