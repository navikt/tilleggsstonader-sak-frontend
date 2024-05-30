import React, { Dispatch, SetStateAction } from 'react';

import { Checkbox, VStack } from '@navikt/ds-react';

import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import DateInput from '../../../../komponenter/Skjema/DateInput';

interface Props {
    klageGjelderTilbakekreving: boolean;
    settKlageGjelderTilbakekreving: Dispatch<SetStateAction<boolean>>;
    kravMottattDato: string;
    settKravMottattDato: Dispatch<SetStateAction<string>>;
    feilmelding: string | undefined;
}

const OpprettKlageBehandling: React.FC<Props> = ({
    klageGjelderTilbakekreving,
    settKlageGjelderTilbakekreving,
    kravMottattDato,
    settKravMottattDato,
    feilmelding,
}) => {
    const håndterCheck = () => {
        settKlageGjelderTilbakekreving((prevState) => !prevState);
    };

    return (
        <VStack gap="8">
            <Checkbox size="small" checked={klageGjelderTilbakekreving} onChange={håndterCheck}>
                Klagen gjelder tilbakekreving
            </Checkbox>
            <DateInput
                label={'Krav mottat'}
                onChange={(dato: string | undefined) => settKravMottattDato(dato || '')}
                value={kravMottattDato}
            />
            <Feilmelding variant={'alert'}>{feilmelding}</Feilmelding>
        </VStack>
    );
};

export default OpprettKlageBehandling;
