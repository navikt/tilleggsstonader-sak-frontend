import { Stønadstype } from '../../../../typer/behandling/behandlingTema';

export const stønadstypeTilVedtakUrl: Record<Stønadstype, string> = {
    [Stønadstype.BARNETILSYN]: 'tilsyn-barn',
    [Stønadstype.LÆREMIDLER]: 'laremidler',
    [Stønadstype.BOUTGIFTER]: 'boutgifter',
    //TODO Sjekk at vi ønsker ulike URLer
    [Stønadstype.DAGLIG_REISE_TSR]: 'daglig-reise-tiltaksenheten',
    [Stønadstype.DAGLIG_REISE_TSO]: 'daglig-reise-nay',
};
