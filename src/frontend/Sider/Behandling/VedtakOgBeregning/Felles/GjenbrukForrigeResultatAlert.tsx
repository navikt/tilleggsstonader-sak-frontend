import React, { FC } from 'react';

import { Alert } from '@navikt/ds-react';

import { Beregningsplan, BeregningsplanOmfang } from '../../../../typer/vedtak/beregningsplan';

export const GjenbrukForrigeResultatAlert: FC<{ beregningsplan: Beregningsplan }> = ({
    beregningsplan,
}) => {
    return (
        beregningsplan.omfang === BeregningsplanOmfang.GJENBRUK_FORRIGE_RESULTAT && (
            <Alert variant="info" size="small" inline>
                Beregningsresultatet er <strong>uendret</strong> fra forrige vedtak.
            </Alert>
        )
    );
};
