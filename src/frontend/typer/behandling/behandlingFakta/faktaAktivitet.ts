import { JaNei } from '../../common';

export interface FaktaAktivtet {
    søknadsgrunnlag?: SøknadsgrunnlagAktivitet;
}

interface SøknadsgrunnlagAktivitet {
    utdanning: JaNei;
}
