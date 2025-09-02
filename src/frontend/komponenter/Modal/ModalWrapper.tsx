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
    const umamiData = {
        modalId: umamiId,
        tittel: tittel,
    };

    const sendModalÅpnetTilUmami = () => {
        sendHendelseTilUmami(UmamiHendelse.MODAL_ÅPNET, umamiData);
    };

    const sendModalLukketTilUmami = (lukkMetode: 'hovedKnapp' | 'sekundærKnapp' | 'lukkKnapp') => {
        sendHendelseTilUmami(UmamiHendelse.MODAL_LUKKET, { ...umamiData, lukkMetode: lukkMetode });
    };

    if (visModal) {
        sendModalÅpnetTilUmami();
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
                    </Modal.Footer>
                )}
            </ModalContainer>
        )
    );
};
