import React from 'react';

import { Detail, VStack } from '@navikt/ds-react';

import { HendelseMetadata } from './typer';
import {
    erSendtTilBeslutterMetadata,
    erSettPåVentMetadata,
    erTattAvVentMetadata,
    erVedtakUnderkjentMetadata,
} from './utils';
import begrunnelseStyles from '../../../../komponenter/Begrunnelse.module.css';
import { årsakTilTekst } from '../../../../komponenter/SettPåVent/typer';
import { årsakUnderkjentTilTekst } from '../../Totrinnskontroll/typer';

const Metadata: React.FC<{ metadata: HendelseMetadata }> = ({ metadata }) => {
    if (erSettPåVentMetadata(metadata)) {
        const venterPå = metadata.årsaker.map((årsak) => årsakTilTekst[årsak]).join(', ');

        return (
            <>
                <Detail>{venterPå}</Detail>
                {metadata.kommentarSettPåVent && (
                    <Detail className={begrunnelseStyles.bevarLinjeskift}>
                        {metadata.kommentarSettPåVent}
                    </Detail>
                )}
            </>
        );
    }
    if (erTattAvVentMetadata(metadata)) {
        return (
            metadata.kommentar && (
                <Detail className={begrunnelseStyles.bevarLinjeskift}>{metadata.kommentar}</Detail>
            )
        );
    }

    if (erVedtakUnderkjentMetadata(metadata)) {
        const årsaker = metadata.årsakerUnderkjent
            .map((årsak) => årsakUnderkjentTilTekst[årsak])
            .join(', ');

        return (
            <VStack gap="space-4">
                <Detail>{årsaker}</Detail>
                <Detail className={begrunnelseStyles.bevarLinjeskift}>
                    Kommentar: {metadata.begrunnelse}
                </Detail>
            </VStack>
        );
    }

    if (erSendtTilBeslutterMetadata(metadata) && metadata.kommentarTilBeslutter) {
        return (
            <Detail className={begrunnelseStyles.bevarLinjeskift}>
                Kommentar: {metadata.kommentarTilBeslutter}
            </Detail>
        );
    }

    return null;
};

export default Metadata;
