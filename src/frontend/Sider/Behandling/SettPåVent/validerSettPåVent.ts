import { SettPåVent, SettPåVentError } from './typer';
import { FormErrors } from '../../../hooks/felles/useFormState';
import { harIkkeVerdi } from '../../../utils/utils';

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

    return feil;
};
