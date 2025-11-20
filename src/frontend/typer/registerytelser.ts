import { MålgruppeType } from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';

export interface Registerytelser {
    perioder: PeriodeYtelseRegister[];
    kildeResultat: KildeResultatYtelse[];
    tidspunktHentet: string;
    perioderHentetFom: string;
    perioderHentetTom: string;
}

export interface PeriodeYtelseRegister {
    type: TypeRegisterYtelse;
    fom: string;
    tom?: string;
    aapErFerdigAvklart?: boolean;
    ensligForsørgerStønadstype?: EnsligForsørgerStønadstype;
}

type EnsligForsørgerStønadstype = 'OVERGANGSSTØNAD' | 'SKOLEPENGER' | 'BARNETILSYN';

export const ensligForsørgerStønadstypeTekst: Record<EnsligForsørgerStønadstype, string> = {
    OVERGANGSSTØNAD: 'Overgangsstønad',
    SKOLEPENGER: 'Skolepenger',
    BARNETILSYN: 'Barnetilsyn (Enslig forsørger)',
};

export interface KildeResultatYtelse {
    type: TypeRegisterYtelse;
    resultat: 'OK' | 'FEILET';
}

export enum TypeRegisterYtelse {
    AAP = 'AAP',
    DAGPENGER = 'DAGPENGER',
    TILTAKSPENGER_TPSAK = 'TILTAKSPENGER_TPSAK',
    TILTAKSPENGER_ARENA = 'TILTAKSPENGER_ARENA',
    ENSLIG_FORSØRGER = 'ENSLIG_FORSØRGER',
    OMSTILLINGSSTØNAD = 'OMSTILLINGSSTØNAD',
}

export const typeRegisterYtelseTilMålgruppeType: Record<TypeRegisterYtelse, MålgruppeType> = {
    AAP: MålgruppeType.AAP,
    ENSLIG_FORSØRGER: MålgruppeType.OVERGANGSSTØNAD,
    OMSTILLINGSSTØNAD: MålgruppeType.OMSTILLINGSSTØNAD,
    TILTAKSPENGER_TPSAK: MålgruppeType.TILTAKSPENGER,
    TILTAKSPENGER_ARENA: MålgruppeType.TILTAKSPENGER,
    DAGPENGER: MålgruppeType.DAGPENGER,
};

export const registerYtelseTilTekst: Record<TypeRegisterYtelse, string> = {
    AAP: 'arbeidsavklaringspenger',
    TILTAKSPENGER_TPSAK: 'tiltakspenger (ny løsning)',
    TILTAKSPENGER_ARENA: 'tiltakspenger (Arena)',
    DAGPENGER: 'dagpenger',
    ENSLIG_FORSØRGER: 'overgangsstønad',
    OMSTILLINGSSTØNAD: 'omstillingsstønad',
};

export const registerYtelseTilTekstStorForbokstav: Record<TypeRegisterYtelse, string> = {
    AAP: 'Arbeidsavklaringspenger',
    TILTAKSPENGER_TPSAK: 'Tiltakspenger (ny løsning)',
    TILTAKSPENGER_ARENA: 'Tiltakspenger (Arena)',
    DAGPENGER: 'Dagpenger',
    ENSLIG_FORSØRGER: 'Enslig forsørger',
    OMSTILLINGSSTØNAD: 'Omstillingsstønad',
};
