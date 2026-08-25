import { Stønadstype } from '../../../../typer/behandling/behandlingTema';

export const stønadstypeTilVedtakUrl: Record<Stønadstype, string> = {
    [Stønadstype.BARNETILSYN]: 'tilsyn-barn',
    [Stønadstype.LÆREMIDLER]: 'laremidler',
    [Stønadstype.BOUTGIFTER]: 'boutgifter',
    [Stønadstype.DAGLIG_REISE_TSR]: 'daglig-reise',
    [Stønadstype.DAGLIG_REISE_TSO]: 'daglig-reise',
    [Stønadstype.REISE_TIL_SAMLING_TSO]: 'reise-til-samling',
    [Stønadstype.REISE_TIL_SAMLING_TSR]: 'reise-til-samling',
    [Stønadstype.FLYTTING_TSO]: 'flytting',
    [Stønadstype.FLYTTING_TSR]: 'flytting',
    // TODO: avklar vedtakUrl for STØTTE_TIL_REISE_OPPSTART_AVSLUTNING_HJEMREISE
    [Stønadstype.STØTTE_TIL_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO]:
        'støtte-til-reise-oppstart-avslutning-hjemreise',
    [Stønadstype.STØTTE_TIL_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR]:
        'støtte-til-reise-oppstart-avslutning-hjemreise',
};
