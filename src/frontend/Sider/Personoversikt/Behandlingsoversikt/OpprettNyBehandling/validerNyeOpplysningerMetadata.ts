import { useState } from 'react';

import {
    NyeOpplysningerEndringer,
    ÅrsakMetadata,
} from '../../../../typer/behandling/nyeOpplysningerMetadata';
import { harIkkeVerdi } from '../../../../utils/utils';

export interface FeilNyeOpplysningerMetadata {
    kilde: string | undefined;
    endringer: string | undefined;
}

export const useValiderNyeOpplysningerMetadata = () => {
    const [feilNyeOpplysningerMetadata, settFeilNyeOpplysningerMetadata] =
        useState<FeilNyeOpplysningerMetadata>({
            kilde: undefined,
            endringer: undefined,
        });

    const validerNyeOpplysningerMetadata = (
        metadata: ÅrsakMetadata | undefined,
        nyeOpplysningerEndringer: NyeOpplysningerEndringer | undefined
    ) => {
        if (!metadata) {
            settFeilNyeOpplysningerMetadata({
                kilde: 'Kilde må velges',
                endringer: 'Minst en endring må velges',
            });
            return false;
        }

        if (harIkkeVerdi(metadata.kilde)) {
            settFeilNyeOpplysningerMetadata((prevState) => ({
                ...prevState,
                kilde: 'Kilde må velges',
            }));
            return false;
        }

        if (nyeOpplysningerEndringer?.endringer.length === 0) {
            settFeilNyeOpplysningerMetadata((prevState) => ({
                ...prevState,
                endringer: 'Minst en endring må velges',
            }));
            return false;
        }
        return true;
    };

    const nullstillFeilForFelt = (key: keyof FeilNyeOpplysningerMetadata) => {
        settFeilNyeOpplysningerMetadata((prevState) => ({
            ...prevState,
            [key]: undefined,
        }));
    };

    return {
        validerNyeOpplysningerMetadata,
        feilNyeOpplysningerMetadata,
        nullstillFeilForFelt,
    };
};
