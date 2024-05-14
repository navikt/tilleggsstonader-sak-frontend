export const erProd = (): boolean => window.location.host === 'tilleggsstonader.intern.nav.no';

export const erLokalt = (): boolean =>
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
