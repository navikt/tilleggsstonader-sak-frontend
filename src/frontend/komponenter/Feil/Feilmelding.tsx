import React from 'react';

import { Alert, BodyShort, CopyButton, Detail, HStack, Label } from '@navikt/ds-react';

import { Feil, finnFeilmeldingVariant } from './feilmeldingUtils';

interface Props {
    feil: Feil | string | undefined;
}

export const Feilmelding = React.forwardRef<HTMLDivElement | HTMLParagraphElement, Props>(
    function Feilmelding({ feil }, ref) {
        if (!feil) {
            return null;
        }

        if (typeof feil === 'string') {
            return (
                <Alert variant="warning" size="small" ref={ref}>
                    {feil}
                </Alert>
            );
        }

        return (
            <Alert variant={finnFeilmeldingVariant(feil.status)} size="small" ref={ref} fullWidth>
                {feil.tittel && <Label size="small">{feil.tittel}</Label>}

                <BodyShort style={{ whiteSpace: 'pre-wrap' }} size="small">
                    {feil.feilmelding}
                </BodyShort>
                <HStack align="center" wrap={false}>
                    {feil.feilkode && <Detail>Feilkode: {feil.feilkode}</Detail>}
                    {feil.feilmeldingMedFeilkode && (
                        <CopyButton copyText={feil.feilmeldingMedFeilkode} size="small" />
                    )}
                </HStack>
            </Alert>
        );
    }
);
