import React from 'react';

import styled from 'styled-components';

import { Button, Modal } from '@navikt/ds-react';

const ModalContainer = styled(Modal)<{ maxWidth?: number }>`
    min-width: 30rem;
    max-width: ${(props) => (props.maxWidth ? `${props.maxWidth}rem` : '40rem')};
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
}

interface Aksjonsknapp {
    onClick: () => void;
    tekst: string;
    disabled?: boolean;
}

export const ModalWrapper: React.FC<ModalProps> = ({
    tittel,
    visModal,
    onClose,
    aksjonsknapper,
    maxWidth,
    ariaLabel,
    children,
}) => {
    return (
        visModal && (
            <ModalContainer
                open={visModal}
                onClose={onClose ? () => onClose() : () => null}
                maxWidth={maxWidth}
                aria-label={ariaLabel ? ariaLabel : tittel || ''}
                header={tittel ? { heading: tittel, closeButton: !!onClose } : undefined}
            >
                <Modal.Body>{children}</Modal.Body>
                {aksjonsknapper && (
                    <Modal.Footer>
                        <Button
                            variant="primary"
                            onClick={aksjonsknapper.hovedKnapp.onClick}
                            disabled={aksjonsknapper.hovedKnapp.disabled}
                            size="small"
                        >
                            {aksjonsknapper.hovedKnapp.tekst}
                        </Button>
                        {aksjonsknapper.sekundærKnapp && (
                            <Button
                                variant="secondary"
                                onClick={aksjonsknapper.sekundærKnapp.onClick}
                                disabled={aksjonsknapper.sekundærKnapp.disabled}
                                size="small"
                            >
                                {aksjonsknapper.sekundærKnapp.tekst}
                            </Button>
                        )}
                        <Button
                            variant="tertiary"
                            onClick={aksjonsknapper.lukkKnapp.onClick}
                            disabled={aksjonsknapper.lukkKnapp.disabled}
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
