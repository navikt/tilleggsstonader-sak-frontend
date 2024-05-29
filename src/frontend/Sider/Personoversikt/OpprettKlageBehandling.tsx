import React, { Dispatch, SetStateAction } from 'react';

import { styled } from 'styled-components';

import { Checkbox } from '@navikt/ds-react';

import { Feilmelding } from '../../komponenter/Feil/Feilmelding';
import DateInput from '../../komponenter/Skjema/DateInput';

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

    const DatoWrapper = styled.div`
        margin-top: 1rem;
    `;

    return (
        <>
            <Checkbox size="small" checked={klageGjelderTilbakekreving} onChange={håndterCheck}>
                Klagen gjelder tilbakekreving
            </Checkbox>
            <DatoWrapper>
                <DateInput
                    label={'Krav mottat'}
                    onChange={(dato: string | undefined) => settKravMottattDato(dato || '')}
                    value={kravMottattDato}
                />
            </DatoWrapper>
            <Feilmelding variant={'alert'}>{feilmelding}</Feilmelding>
        </>
    );
};

export default OpprettKlageBehandling;
