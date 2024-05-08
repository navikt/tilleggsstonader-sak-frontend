export const erProd = (): boolean => !(erLokalt() || erDev());

export const erDev = (): boolean => window.location.host.includes('dev.nav.no');

export const erLokalt = (): boolean =>
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
