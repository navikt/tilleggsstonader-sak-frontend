type hendelse = 'vis bekreft endring på periode som påviker tidligere vedtak modal' | 'test';

export const sendHendelseTilUmami = (navn: hendelse, data: object) => {
    if (typeof window !== 'undefined' && window.umami) {
        window.umami.track(navn, data);
    }
};
