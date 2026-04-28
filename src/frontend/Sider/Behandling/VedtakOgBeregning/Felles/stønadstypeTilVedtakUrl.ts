import { Stønadstype } from '../../../../typer/behandling/behandlingTema';

export const stønadstypeTilVedtakUrl: Record<Stønadstype, string> = {
    [Stønadstype.BARNETILSYN]: 'tilsyn-barn',
    [Stønadstype.LÆREMIDLER]: 'laremidler',
    [Stønadstype.BOUTGIFTER]: 'boutgifter',
    [Stønadstype.DAGLIG_REISE_TSR]: 'daglig-reise',
    [Stønadstype.DAGLIG_REISE_TSO]: 'daglig-reise',
    [Stønadstype.REISE_TIL_SAMLING_TSO]: 'reise-til-samling',
};
