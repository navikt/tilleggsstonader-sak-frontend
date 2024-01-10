export interface SelectOption {
    value: string;
    label: string;
}

export enum Arkivtema {
    TSO = 'TSO',
    TSR = 'TSR',
}

export const arkivtemaerListe = Object.values(Arkivtema);
