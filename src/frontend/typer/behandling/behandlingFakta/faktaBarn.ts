import { JaNei } from '../../common';

export interface FaktaBarn {
    ident: string;
    barnId: string;
    registergrunnlag: RegistergrunnlagBarn;
    søknadgrunnlag?: SøknadsgrunnlagBarn;
}

interface RegistergrunnlagBarn {
    navn: string;
    dødsdato?: string;
    alder?: number;
}

interface SøknadsgrunnlagBarn {
    type: TypeBarnepass;
    startetIFemte?: JaNei;
    årsak?: ÅrsakBarnepass;
}

enum TypeBarnepass {
    BARNEHAGE_SFO_AKS = 'BARNEHAGE_SFO_AKS',
    PRIVAT = 'PRIVAT',

    // Deprecated, brukes ikke lengre i søknaden
    ANDRE = 'ANDRE',
}

export const typeBarnepassTilTekst: Record<TypeBarnepass, string> = {
    BARNEHAGE_SFO_AKS: 'Barnehage, SFO eller AKS',
    PRIVAT: 'Privat ordning',

    ANDRE: 'Andre',
};

enum ÅrsakBarnepass {
    TRENGER_MER_PASS_ENN_JEVNALDRENDE = 'TRENGER_MER_PASS_ENN_JEVNALDRENDE',
    MYE_BORTE_ELLER_UVANLIG_ARBEIDSTID = 'MYE_BORTE_ELLER_UVANLIG_ARBEIDSTID',
}

export const årsakBarnepassTilTekst: Record<ÅrsakBarnepass, string> = {
    TRENGER_MER_PASS_ENN_JEVNALDRENDE: 'Trenger mer pass enn jevnaldrende',
    MYE_BORTE_ELLER_UVANLIG_ARBEIDSTID: 'Mye borte eller uvanlig arbeidstid',
};
