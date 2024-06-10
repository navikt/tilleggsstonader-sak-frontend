import React, { Dispatch, SetStateAction } from 'react';

import { VStack } from '@navikt/ds-react';

import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import DateInput from '../../../../komponenter/Skjema/DateInput';

interface Props {
    kravMottattDato: string;
    settKravMottattDato: Dispatch<SetStateAction<string>>;
    feilmelding: string | undefined;
}

const OpprettKlageBehandling: React.FC<Props> = ({
    kravMottattDato,
    settKravMottattDato,
    feilmelding,
}) => {
    return (
        <VStack gap="8">
            <DateInput
                label={'Krav mottatt'}
                onChange={(dato: string | undefined) => settKravMottattDato(dato || '')}
                value={kravMottattDato}
            />
            <Feilmelding variant={'alert'}>{feilmelding}</Feilmelding>
        </VStack>
    );
};

export default OpprettKlageBehandling;
