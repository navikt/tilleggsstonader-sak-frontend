import * as React from 'react';

import { Alert, BodyShort, Heading, Label } from '@navikt/ds-react';

import styles from './FeilregistrertVisning.module.css';
import { KlageinstansEventType } from '../../../../typer/klage';
import { formaterIsoDatoTid } from '../../../../utils/dato';
import { Klagebehandling } from '../../typer/klagebehandling/klagebehandling';

export const FeilregistrertVisning: React.FC<{ behandling: Klagebehandling }> = ({
    behandling,
}) => {
    const feilregistrertResultat = behandling.klageinstansResultat.find(
        (resultat) => resultat.type === KlageinstansEventType.BEHANDLING_FEILREGISTRERT
    );

    return feilregistrertResultat ? (
        <Alert variant={'warning'} className={styles.alertMedMaxbredde}>
            <Heading spacing size="small" level="3">
                Behandling feilregistrert av NAV klageinstans
            </Heading>
            <Label size={'small'}>
                {formaterIsoDatoTid(feilregistrertResultat.mottattEllerAvsluttetTidspunkt)}
            </Label>
            <BodyShort>{feilregistrertResultat.årsakFeilregistrert}</BodyShort>
        </Alert>
    ) : null;
};
