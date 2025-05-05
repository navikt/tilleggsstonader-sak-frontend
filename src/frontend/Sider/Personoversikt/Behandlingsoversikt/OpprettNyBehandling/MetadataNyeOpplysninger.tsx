import React, { Dispatch, SetStateAction } from 'react';

import { Checkbox, CheckboxGroup, Select, Textarea } from '@navikt/ds-react';

import { tomNyeOpplysningerMetadata } from './OpprettNyBehandlingUtils';
import { FeilNyeOpplysningerMetadata } from './validerNyeOpplysningerMetadata';
import {
    NyeOpplysningerEndring,
    nyeOpplysningerEndringTilTekst,
    NyeOpplysningerKilde,
    nyeOpplysningerKildeTilTekst,
    NyeOpplysningerMetadata,
} from '../../../../typer/behandling/nyeOpplysningerMetadata';

interface Props {
    nyeOpplysningerMetadata: NyeOpplysningerMetadata | undefined;
    settnyeOpplysningerMetadata: Dispatch<SetStateAction<NyeOpplysningerMetadata | undefined>>;
    feil: FeilNyeOpplysningerMetadata;
    nullstillFeilForFelt: (key: keyof FeilNyeOpplysningerMetadata) => void;
}

const MetadataNyeOpplysninger = ({
    nyeOpplysningerMetadata,
    settnyeOpplysningerMetadata,
    feil,
    nullstillFeilForFelt,
}: Props) => {
    const oppdater = (
        key: keyof NyeOpplysningerMetadata,
        value: NyeOpplysningerKilde | NyeOpplysningerEndring[] | string | undefined
    ) => {
        settnyeOpplysningerMetadata((prevState) => {
            if (prevState) {
                return { ...prevState, [key]: value };
            }
            return { ...tomNyeOpplysningerMetadata, [key]: value };
        });
        if (key !== 'beskrivelse') {
            nullstillFeilForFelt(key);
        }
    };

    return (
        <>
            <Select
                label={'Kilde til opplysninger'}
                onChange={(e) => oppdater('kilde', e.target.value as NyeOpplysningerKilde)}
                error={feil.kilde}
            >
                <option value={''}>-Velg kilde-</option>
                {Object.keys(NyeOpplysningerKilde).map((kilde) => (
                    <option key={kilde} value={kilde}>
                        {nyeOpplysningerKildeTilTekst[kilde]}
                    </option>
                ))}
            </Select>

            <CheckboxGroup
                legend={'Hva er endret?'}
                onChange={(endringer: NyeOpplysningerEndring[]) =>
                    oppdater('endringer', endringer as NyeOpplysningerEndring[])
                }
                error={feil.endringer}
            >
                {Object.values(NyeOpplysningerEndring).map((endring) => (
                    <Checkbox key={endring} value={endring}>
                        {nyeOpplysningerEndringTilTekst[endring]}
                    </Checkbox>
                ))}
            </CheckboxGroup>
            <Textarea
                label={'Beskrivelse (valgfri)'}
                value={nyeOpplysningerMetadata?.beskrivelse}
                onChange={(e) => oppdater('beskrivelse', e.target.value)}
            />
        </>
    );
};
export default MetadataNyeOpplysninger;
