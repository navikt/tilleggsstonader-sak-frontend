import { NyMålgruppe } from './LeggTilMålgruppe';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { erDatoEtterEllerLik } from '../../../../utils/dato';

export const validerForm = ({ fom, tom, type }: NyMålgruppe): FormErrors<NyMålgruppe> => {
    const feil: FormErrors<NyMålgruppe> = {
        fom: undefined,
        tom: undefined,
        type: undefined,
    };
    if (!type) {
        return { ...feil, type: 'Mangler type for periode' };
    }
    if (!fom) {
        return { ...feil, fom: 'Mangler fradato for periode' };
    }

    if (!tom) {
        return { ...feil, tom: 'Mangler tildato for periode' };
    }

    if (!erDatoEtterEllerLik(tom, fom)) {
        return {
            ...feil,
            tom: 'Sluttdato (til) må være etter startdato (fra) for periode',
        };
    }
    return feil;
};
