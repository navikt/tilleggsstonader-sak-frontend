import React from 'react';

import { BodyShort, List } from '@navikt/ds-react';

import { useBrevFeilContext } from '../../context/BrevFeilContext';
import { Feilmelding } from '../Feil/Feilmelding';

export const FeilmeldingBrev = ({ feilmelding }: { feilmelding: string | undefined }) => {
    const { manglendeBrevVariabler, manglendeValgfelt } = useBrevFeilContext();

    return (
        feilmelding && (
            <Feilmelding variant="alert" size={'small'}>
                {feilmelding}
                {manglendeBrevVariabler.length > 0 && (
                    <List size={'small'}>
                        <BodyShort size={'small'}>Felt som mangler verdi</BodyShort>
                        {manglendeBrevVariabler.map((variabel, index) => (
                            <List.Item key={`${variabel._id}-${index}`}>
                                {variabel.visningsnavn}
                            </List.Item>
                        ))}
                    </List>
                )}
                {manglendeValgfelt.length > 0 && (
                    <List size={'small'}>
                        <BodyShort size={'small'}>Valg som mangler verdi</BodyShort>
                        {manglendeValgfelt.map((valgfelt, index) => (
                            <List.Item key={`${valgfelt._id}-${index}`}>
                                {valgfelt.visningsnavn}
                            </List.Item>
                        ))}
                    </List>
                )}
            </Feilmelding>
        )
    );
};
