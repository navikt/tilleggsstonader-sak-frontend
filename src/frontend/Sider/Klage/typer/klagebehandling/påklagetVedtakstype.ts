export enum PåklagetVedtakstype {
    VEDTAK = 'VEDTAK',
    UTEN_VEDTAK = 'UTEN_VEDTAK',
    IKKE_VALGT = 'IKKE_VALGT',
    ARENA_ORDINÆRT_VEDTAK = 'ARENA_ORDINÆRT_VEDTAK',
    ARENA_TILBAKEKREVING = 'ARENA_TILBAKEKREVING',
}

export const påklagetVedtakstypeTilTekst: Record<PåklagetVedtakstype, string> = {
    IKKE_VALGT: 'Ikke valgt',
    UTEN_VEDTAK: 'Har ikke klaget på et vedtak',
    VEDTAK: 'Vedtak',
    ARENA_ORDINÆRT_VEDTAK: 'Ordinært stønadsvedtak i Arena',
    ARENA_TILBAKEKREVING: 'Tilbakekreving i Arena',
};
