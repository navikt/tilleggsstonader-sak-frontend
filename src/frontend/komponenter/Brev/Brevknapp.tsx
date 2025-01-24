import { useState } from 'react';
import React from 'react';

import styled from 'styled-components';

import { BodyShort, Button, List, VStack } from '@navikt/ds-react';

import { MalStruktur, Valg, Valgfelt, Variabel } from './typer';
import { useBrevFeilContext } from '../../context/BrevFeilContext';
import { Feilmelding } from '../Feil/Feilmelding';

const Knapp = styled(Button)`
    display: block;
`;

interface Props {
    tittel: string;
    onClick: () => Promise<void>;

    mal: MalStruktur;
    inkluderteDelmaler: Record<string, boolean>;
    valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>;
    variabler: Partial<Record<string, string>>;
}

export const Brevknapp = ({
    tittel,
    onClick,
    mal,
    inkluderteDelmaler,
    valgfelt,
    variabler,
}: Props) => {
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const { oppdaterManglendeBrevVariabler } = useBrevFeilContext();

    const trykkPåKnapp = () => {
        settFeilmelding(undefined);

        const harMangelResultat = oppdaterManglendeBrevVariabler(
            mal,
            inkluderteDelmaler,
            valgfelt,
            variabler
        );

        if (harMangelResultat === 'HAR_MANGEL') {
            settFeilmelding('Kan ikke gå videre, følgende felter mangler fra brev:');
            return;
        }

        settLaster(true);

        onClick()
            .catch((error) =>
                settFeilmelding(error instanceof Error ? error.message : String(error))
            )
            .finally(() => settLaster(false));
    };

    return (
        <VStack gap={'2'}>
            <Knapp onClick={trykkPåKnapp} disabled={laster}>
                {tittel}
            </Knapp>
            <FeilmeldingBrev feilmelding={feilmelding} />
        </VStack>
    );
};

const FeilmeldingBrev = ({ feilmelding }: { feilmelding: string | undefined }) => {
    const { manglendeBrevVariabler } = useBrevFeilContext();
    return (
        feilmelding && (
            <Feilmelding variant="alert" size={'small'}>
                {feilmelding}
                <ListeMedMangler
                    tittel={'Felt som mangler verdi'}
                    mangler={manglendeBrevVariabler}
                />
            </Feilmelding>
        )
    );
};

const ListeMedMangler = ({ tittel, mangler }: { tittel: string; mangler: Variabel[] }) => {
    return (
        mangler.length > 0 && (
            <List size={'small'}>
                <BodyShort size={'small'}>{tittel}</BodyShort>
                {mangler.map((mangel, index) => (
                    <List.Item key={`${mangel._id}-${index}`}>{mangel.visningsnavn}</List.Item>
                ))}
            </List>
        )
    );
};
