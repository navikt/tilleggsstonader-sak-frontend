import React, { Dispatch, SetStateAction } from 'react';

import { Checkbox, CheckboxGroup, Select, Textarea } from '@navikt/ds-react';

import { tomÅrsakMetadata } from './OpprettNyBehandlingUtils';
import { FeilNyeOpplysningerMetadata } from './validerNyeOpplysningerMetadata';
import {
    nyeOpplysningerEndringTilTekst,
    ÅrsakMetadata,
    ÅrsakMetadataEndring,
    ÅrsakMetadataKilde,
    årsakMetadataKildeeTilTekst,
} from '../../../../typer/behandling/nyeOpplysningerMetadata';

interface Props {
    årsakMetadata: ÅrsakMetadata | undefined;
    settårsakMetadata: Dispatch<SetStateAction<ÅrsakMetadata | undefined>>;
    feil: FeilNyeOpplysningerMetadata;
    nullstillFeilForFelt: (key: keyof FeilNyeOpplysningerMetadata) => void;
}

const MetadataNyeOpplysninger = ({
    årsakMetadata,
    settårsakMetadata,
    feil,
    nullstillFeilForFelt,
}: Props) => {
    const oppdater = (
        key: keyof ÅrsakMetadata,
        value: ÅrsakMetadataKilde | ÅrsakMetadataEndring[] | string | undefined
    ) => {
        settårsakMetadata((prevState) => {
            if (prevState) {
                return { ...prevState, [key]: value };
            }
            return { ...tomÅrsakMetadata, [key]: value };
        });
        if (key !== 'beskrivelse') {
            nullstillFeilForFelt(key);
        }
    };
    return (
        <>
            <Select
                label={'Kilde til opplysninger'}
                onChange={(e) => oppdater('kilde', e.target.value as ÅrsakMetadataKilde)}
                error={feil.kilde}
            >
                <option value={''}>-Velg kilde-</option>
                {Object.keys(ÅrsakMetadataKilde).map((kilde) => (
                    <option key={kilde} value={kilde}>
                        {årsakMetadataKildeeTilTekst[kilde]}
                    </option>
                ))}
            </Select>

            <CheckboxGroup
                legend={'Hva er endret?'}
                onChange={(endringer: ÅrsakMetadataEndring[]) =>
                    oppdater('endringer', endringer as ÅrsakMetadataEndring[])
                }
                error={feil.endringer}
            >
                {Object.values(ÅrsakMetadataEndring).map((endring) => (
                    <Checkbox key={endring} value={endring}>
                        {nyeOpplysningerEndringTilTekst[endring]}
                    </Checkbox>
                ))}
            </CheckboxGroup>
            <Textarea
                label={'Beskrivelse (valgfri)'}
                value={årsakMetadata?.beskrivelse}
                onChange={(e) => oppdater('beskrivelse', e.target.value)}
            />
        </>
    );
};
export default MetadataNyeOpplysninger;
