export enum PåklagetVedtakstype {
    VEDTAK = 'VEDTAK',
    UTEN_VEDTAK = 'UTEN_VEDTAK',
    IKKE_VALGT = 'IKKE_VALGT',
}

export const påklagetVedtakstypeTilTekst: Record<PåklagetVedtakstype, string> = {
    IKKE_VALGT: 'Ikke valgt',
    UTEN_VEDTAK: 'Har ikke klaget på et vedtak',
    VEDTAK: 'Vedtak',
};