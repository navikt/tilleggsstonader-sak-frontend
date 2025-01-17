import {
    HendelseMetadata,
    SattPåVentMetadata,
    TattAvVentMetadata,
    VedtakUnderkjentMetadata,
} from './typer';

export const erSettPåVentMetadata = (
    metadata: HendelseMetadata
): metadata is SattPåVentMetadata => {
    return 'årsaker' in metadata;
};

export const erVedtakUnderkjentMetadata = (
    metadata: HendelseMetadata
): metadata is VedtakUnderkjentMetadata => {
    return 'årsakerUnderkjent' in metadata && !!metadata.begrunnelse;
};

export const erTattAvVentMetadata = (
    metadata: HendelseMetadata
): metadata is TattAvVentMetadata => {
    return 'kommentar' in metadata;
};
