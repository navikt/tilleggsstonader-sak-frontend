export interface ISide {
    href: string;
    navn: string;
    rekkefølge: number;
}

export enum SideNavn {
    FORMKRAV = 'Formkrav',
    VURDERING = 'Vurdering',
    BREV = 'Brev',
    RESULTAT = 'Resultat',
}

export const alleSider: ISide[] = [
    {
        href: 'formkrav',
        navn: SideNavn.FORMKRAV,
        rekkefølge: 1,
    },
    {
        href: 'vurdering',
        navn: SideNavn.VURDERING,
        rekkefølge: 2,
    },
    {
        href: 'brev',
        navn: SideNavn.BREV,
        rekkefølge: 3,
    },
    {
        href: 'resultat',
        navn: SideNavn.RESULTAT,
        rekkefølge: 4,
    },
];
