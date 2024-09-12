import { MålgruppeType } from '../Sider/Behandling/Inngangsvilkår/typer/målgruppe';

export interface Registerytelser {
    perioder: PeriodeYtelseRegister[];
    hentetInformasjon: HentetInformasjon[];
    tidspunktHentet: string;
}

export interface PeriodeYtelseRegister {
    type: TypeRegisterYtelse;
    fom: string;
    tom?: string;
    aapErFerdigAvklart?: boolean;
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

export const typeRegisterYtelseTilMålgruppeType: Record<TypeRegisterYtelse, MålgruppeType> = {
    AAP: MålgruppeType.AAP,
    ENSLIG_FORSØRGER: MålgruppeType.OVERGANGSSTØNAD,
    OMSTILLINGSSTØNAD: MålgruppeType.OMSTILLINGSSTØNAD,
};

export const registerYtelseTilTekst: Record<TypeRegisterYtelse, string> = {
    AAP: 'arbeidsavklaringspenger',
    ENSLIG_FORSØRGER: 'overgangsstønad',
    OMSTILLINGSSTØNAD: 'omstillingsstønad',
};
