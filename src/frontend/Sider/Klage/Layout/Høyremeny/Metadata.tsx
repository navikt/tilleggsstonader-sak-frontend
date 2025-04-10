import React from 'react';

import { Detail } from '@navikt/ds-react';

import { årsakTilTekst } from '../../../../komponenter/SettPåVent/typer';
import { HendelseMetadataKlage, SattPåVentMetadataKlage } from '../../typer/behandlingshistorikk';

export const Metadata: React.FC<{
    metadata: HendelseMetadataKlage;
}> = ({ metadata }) => {
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

    return null;
};

const erSettPåVentMetadata = (
    metadata: HendelseMetadataKlage
): metadata is SattPåVentMetadataKlage => {
    return 'årsaker' in metadata;
};

const erTattAvVentMetadata = (
    metadata: HendelseMetadataKlage
): metadata is HendelseMetadataKlage => {
    return 'kommentar' in metadata;
};
