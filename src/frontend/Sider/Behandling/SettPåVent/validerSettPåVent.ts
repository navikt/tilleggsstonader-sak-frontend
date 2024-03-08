import { SettPåVent, SettPåVentError, ÅrsakSettPåVent } from './typer';
import { FormErrors } from '../../../hooks/felles/useFormState';
import { harIkkeVerdi, harVerdi } from '../../../utils/utils';

export const validerSettPåVent = (settPåVent: SettPåVent): FormErrors<SettPåVentError> => {
    let feil: FormErrors<SettPåVentError> = {
        årsaker: undefined,
        frist: undefined,
        kommentar: undefined,
    };

    if (!settPåVent.årsaker.length) {
        feil = {
            ...feil,
            årsaker: 'Mangler årsaker',
        };
    }
    if (harIkkeVerdi(settPåVent.frist)) {
        feil = {
            ...feil,
            frist: 'Mangler frist',
        };
    }
    if (harValgtAnnet(settPåVent.årsaker) && !harVerdi(settPåVent.kommentar)) {
        feil = {
            ...feil,
            kommentar: 'Mangler påkrevd kommentar',
        };
    }

    return feil;
};

export const harValgtAnnet = (årsaker: ÅrsakSettPåVent[]) =>
    årsaker.some((årsak) => årsak === ÅrsakSettPåVent.ANNET);
