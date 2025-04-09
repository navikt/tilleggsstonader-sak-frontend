import React from 'react';

import { Detail, VStack } from '@navikt/ds-react';

import { HendelseMetadata } from './typer';
import {
    erSendtTilBeslutterMetadata,
    erSettPåVentMetadata,
    erTattAvVentMetadata,
    erVedtakUnderkjentMetadata,
} from './utils';
import { årsakTilTekst } from '../../../../komponenter/SettPåVent/typer';
import { årsakUnderkjentTilTekst } from '../../Totrinnskontroll/typer';

const Metadata: React.FC<{ metadata: HendelseMetadata }> = ({ metadata }) => {
    if (erSettPåVentMetadata(metadata)) {
        const venterPå = metadata.årsaker.map((årsak) => årsakTilTekst[årsak]).join(', ');

        return (
            <>
                <Detail>{venterPå}</Detail>
                {metadata.kommentarSettPåVent && <Detail>{metadata.kommentarSettPåVent}</Detail>}
            </>
        );
    }
    if (erTattAvVentMetadata(metadata)) {
        return metadata.kommentar && <Detail>{metadata.kommentar}</Detail>;
    }

    if (erVedtakUnderkjentMetadata(metadata)) {
        const årsaker = metadata.årsakerUnderkjent
            .map((årsak) => årsakUnderkjentTilTekst[årsak])
            .join(', ');

        return (
            <VStack gap="1">
                <Detail>{årsaker}</Detail>
                <Detail>Kommentar: {metadata.begrunnelse}</Detail>
            </VStack>
        );
    }

    if (erSendtTilBeslutterMetadata(metadata) && metadata.kommentarTilBeslutter) {
        return <Detail>Kommentar: {metadata.kommentarTilBeslutter}</Detail>;
    }

    return null;
};

export default Metadata;
