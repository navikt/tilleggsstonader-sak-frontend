export enum UmamiHendelse {
    MODAL_ÅPNET = 'modal åpnet',
    MODAL_LUKKET = 'modal lukket',
}

export const sendHendelseTilUmami = (navn: UmamiHendelse, data: object) => {
    if (typeof window !== 'undefined' && window.umami) {
        window.umami.track(navn, data);
    }
};
