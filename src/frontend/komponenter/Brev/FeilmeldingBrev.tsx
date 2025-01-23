import React from 'react';

import { BodyShort, List } from '@navikt/ds-react';

import { FeilIDelmal, FeilIDelmalType, useBrevFeilContext } from '../../context/BrevFeilContext';
import { Feilmelding } from '../Feil/Feilmelding';

export const FeilmeldingBrev = ({ feilmelding }: { feilmelding: string | undefined }) => {
    const { manglendeBrevVariabler, manglendeValgfelt } = useBrevFeilContext();

    return (
        feilmelding && (
            <Feilmelding variant="alert" size={'small'}>
                {feilmelding}
                <ListeMedMangler
                    tittel={'Valg som mangler verdi'}
                    delmalerMedMangler={manglendeValgfelt}
                />
                <ListeMedMangler
                    tittel={'Felt som mangler verdi'}
                    delmalerMedMangler={manglendeBrevVariabler}
                />
            </Feilmelding>
        )
    );
};

const ListeMedMangler = ({
    tittel,
    delmalerMedMangler,
}: {
    tittel: string;
    delmalerMedMangler: FeilIDelmal<FeilIDelmalType>[];
}) => {
    const alleMangler = delmalerMedMangler.flatMap((delmal) => delmal.mangler);
    return (
        alleMangler.length > 0 && (
            <List size={'small'}>
                <BodyShort size={'small'}>{tittel}</BodyShort>
                {alleMangler.map((mangel, index) => (
                    <List.Item key={`${mangel._id}-${index}`}>{mangel.visningsnavn}</List.Item>
                ))}
            </List>
        )
    );
};
