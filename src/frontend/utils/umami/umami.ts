export enum UmamiHendelse {
    VIS_BEKREFT_ENDRING_SOM_PÅVIRKER_TIDLIGERE_VEDTAK_MODAL = 'Vis bekreft endring som påviker tidligere vedtak modal',
}

export const sendHendelseTilUmami = (navn: UmamiHendelse, data: object) => {
    if (typeof window !== 'undefined' && window.umami) {
        window.umami.track(navn, data);
    }
};
