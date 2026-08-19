import React, { FC } from 'react';

import { HelpText, HStack, Label } from '@navikt/ds-react';

import DateInput from '../../../../komponenter/Skjema/DateInput';

interface Props {
    kravMottatt: string | undefined;
    onChange: (dato: string | undefined) => void;
}

export const KravMottattDatoFelt: FC<Props> = ({ kravMottatt, onChange }) => (
    <DateInput
        label={
            <HStack gap={'space-8'}>
                <Label>Krav mottatt</Label>
                <HelpText title={'Krav mottatt'}>
                    Krav mottatt kan være når man fikk beskjed om endring eller søknadsdato i
                    tilfelle årsak er søknad
                </HelpText>
            </HStack>
        }
        onChange={onChange}
        value={kravMottatt}
        toDate={new Date()}
    />
);
