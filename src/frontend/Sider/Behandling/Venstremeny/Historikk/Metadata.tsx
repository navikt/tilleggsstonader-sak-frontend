import React from 'react';

import { Detail, VStack } from '@navikt/ds-react';

import { HendelseMetadata } from './typer';
import { erSettPåVentMetadata, erTattAvVentMetadata, erVedtakUnderkjentMetadata } from './utils';
import { useBehandling } from '../../../../context/BehandlingContext';
import { årsakTilTekst } from '../../SettPåVent/typer';
import { årsakUnderkjentTilTekst } from '../../Totrinnskontroll/typer';

const Metadata: React.FC<{ metadata: HendelseMetadata }> = ({ metadata }) => {
    const { behandlingErRedigerbar } = useBehandling();

    if (erSettPåVentMetadata(metadata)) {
        const venterPå = metadata.årsaker.map((årsak) => årsakTilTekst[årsak]).join(', ');

        return (
            <>
                <Detail>{venterPå}</Detail>
                {behandlingErRedigerbar && (
                    <Detail>
                        <i>{metadata.kommentarSettPåVent}</i>
                    </Detail>
                )}
            </>
        );
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

    if (erTattAvVentMetadata(metadata)) {
        return <Detail>{metadata.kommentar}</Detail>;
    }

    return null;
};

export default Metadata;
