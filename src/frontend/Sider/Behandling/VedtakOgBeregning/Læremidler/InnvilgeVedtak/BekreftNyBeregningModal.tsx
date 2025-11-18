import React from 'react';

import { Alert, BodyShort, VStack } from '@navikt/ds-react';

import { ModalWrapper } from '../../../../../komponenter/Modal/ModalWrapper';

export const BekreftNyBeregningModal = ({
    visBekreftModal,
    settVisBekreftModal,
}: {
    visBekreftModal: boolean;
    settVisBekreftModal: (verdi: boolean) => void;
}) => {
    return (
        <ModalWrapper
            visModal={visBekreftModal}
            tittel={'Ny beregning for læremidler'}
            umamiId={'bekreft-ny-beregning-for-læremidler'}
            onClose={() => settVisBekreftModal(false)}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => {
                        settVisBekreftModal(false);
                    },
                    tekst: 'OK',
                },
            }}
        >
            <Alert variant={'warning'}>
                <VStack gap={'2'}>
                    <BodyShort>
                        Denne endringen tar i bruk en ny beregning for læremidler som ikke lenger
                        kutter stønadsperiodene ved nyttår. Dette kan føre til at bruker får
                        utbetalt mindre enn i tidligere vedtak, fordi stønadsperiodene nå beregnes
                        annerledes.
                    </BodyShort>
                    <BodyShort weight={'semibold'}>
                        Sjekk endringen mot tidligere utbetalingsplan og ta kontak med Team
                        Tilleggsstønader hvis du mener dette er feil.
                    </BodyShort>
                </VStack>
            </Alert>
        </ModalWrapper>
    );
};
