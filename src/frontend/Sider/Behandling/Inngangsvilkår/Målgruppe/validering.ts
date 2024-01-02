import { NyMålgruppe } from './LeggTilMålgruppe';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { validerPeriode } from '../../../../utils/periode';

export const validerForm = (nyAktivitet: NyMålgruppe): FormErrors<NyMålgruppe> => {
    const feil: FormErrors<NyMålgruppe> = {
        fom: undefined,
        tom: undefined,
        type: undefined,
    };
    if (!nyAktivitet.type) {
        return { ...feil, type: 'Mangler type for periode' };
    }
    const periodeValidering = validerPeriode(nyAktivitet);
    if (periodeValidering) {
        return {
            ...feil,
            ...periodeValidering,
        };
    }
    return feil;
};
