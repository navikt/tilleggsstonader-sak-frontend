import * as React from 'react';

import styled from 'styled-components';

import { Alert, BodyShort, Heading, Label } from '@navikt/ds-react';

import { KlageinstansEventType } from '../../../../typer/klage';
import { formaterIsoDatoTid } from '../../../../utils/dato';
import { Klagebehandling } from '../../typer/klagebehandling/klagebehandling';

const AlerMedMaxbredde = styled(Alert)`
    max-width: 60rem;
`;

export const FeilregistrertVisning: React.FC<{ behandling: Klagebehandling }> = ({
    behandling,
}) => {
    const feilregistrertResultat = behandling.klageinstansResultat.find(
        (resultat) => resultat.type === KlageinstansEventType.BEHANDLING_FEILREGISTRERT
    );

    return feilregistrertResultat ? (
        <AlerMedMaxbredde variant={'warning'}>
            <Heading spacing size="small" level="3">
                Behandling feilregistrert av NAV klageinstans
            </Heading>
            <Label size={'small'}>
                {formaterIsoDatoTid(feilregistrertResultat.mottattEllerAvsluttetTidspunkt)}
            </Label>
            <BodyShort>{feilregistrertResultat.årsakFeilregistrert}</BodyShort>
        </AlerMedMaxbredde>
    ) : null;
};
