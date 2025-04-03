import { Stønadstype } from '../../../../typer/behandling/behandlingTema';

export const stønadstypeTilVedtakUrl: Record<Stønadstype, string> = {
    [Stønadstype.BARNETILSYN]: 'tilsyn-barn',
    [Stønadstype.LÆREMIDLER]: 'laremidler',
    [Stønadstype.BOUTGIFTER]: 'boutgifter',
};
