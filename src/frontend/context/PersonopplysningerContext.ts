import constate from 'constate';

import { Personopplysninger } from '../typer/personopplysninger';

interface Props {
    personopplysninger: Personopplysninger;
}

export const [PersonopplysningerProvider, usePersonopplysninger] = constate(
    ({ personopplysninger }: Props) => {
        return {
            personopplysninger,
        };
    }
);
