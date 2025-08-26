import React from 'react';

import { ModalWrapper } from '../Modal/ModalWrapper';

export interface StegBekreftelseModal {
    tittel: string;
    tekst: string;
    umamiId: string;
    hovedKnapp: {
        skalTriggeGåTilNesteSteg: boolean;
        tekst: string;
    };
    sekundærKnapp?: {
        skalTriggeGåTilNesteSteg: boolean;
        tekst: string;
    };
    lukkKnapp: {
        tekst: string;
    };
}

export const StegKnappBekreftelsesModal = ({
    modalProps,
    gåTilNesteSteg,
    visModal,
    settVisModal,
}: {
    modalProps: StegBekreftelseModal | undefined;
    gåTilNesteSteg: () => void;
    visModal: boolean;
    settVisModal: (visModal: boolean) => void;
}) => {
    if (!modalProps) {
        return null;
    }
    const { tittel, tekst, hovedKnapp, sekundærKnapp, lukkKnapp, umamiId } = modalProps;
    return (
        <ModalWrapper
            visModal={visModal}
            tittel={tittel}
            umamiId={umamiId}
            onClose={() => settVisModal(false)}
            aksjonsknapper={{
                hovedKnapp: {
                    tekst: hovedKnapp.tekst,
                    onClick: () => {
                        if (hovedKnapp.skalTriggeGåTilNesteSteg) {
                            gåTilNesteSteg();
                        }
                        settVisModal(false);
                    },
                },
                sekundærKnapp: sekundærKnapp
                    ? {
                          tekst: sekundærKnapp.tekst,
                          onClick: () => {
                              if (sekundærKnapp.skalTriggeGåTilNesteSteg) {
                                  gåTilNesteSteg();
                              }
                              settVisModal(false);
                          },
                      }
                    : undefined,
                lukkKnapp: {
                    tekst: lukkKnapp.tekst,
                    onClick: () => settVisModal(false),
                },
            }}
        >
            {tekst}
        </ModalWrapper>
    );
};
