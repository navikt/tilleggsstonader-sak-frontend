export interface Registerytelser {
    perioder: PeriodeYtelseRegister[];
    hentetInformasjon: HentetInformasjon[];
    tidspunktHentet: string;
}

export interface PeriodeYtelseRegister {
    type: TypeRegisterYtelse;
    fom: string;
    tom?: string;
}

export interface HentetInformasjon {
    type: TypeRegisterYtelse;
    status: 'OK' | 'FEILET';
}

export enum TypeRegisterYtelse {
    AAP = 'AAP',
    ENSLIG_FORSØRGER = 'ENSLIG_FORSØRGER',
    OMSTILLINGSSTØNAD = 'OMSTILLINGSSTØNAD',
}

export const registerYtelseTilTekst: Record<TypeRegisterYtelse, string> = {
    AAP: 'AAP',
    ENSLIG_FORSØRGER: 'Enslig forsørger',
    OMSTILLINGSSTØNAD: 'Omstillingsstønad',
};
