import { useState } from 'react';
import React from 'react';

import styled from 'styled-components';

import { BodyShort, Button, List, VStack } from '@navikt/ds-react';

import { MalStruktur, Valg, Valgfelt } from './typer';
import { FeilIDelmalType, useBrevFeilContext } from '../../context/BrevFeilContext';
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
    const { oppdaterMangelIBrev } = useBrevFeilContext();

    const trykkPåKnapp = () => {
        settFeilmelding(undefined);

        const harMangelResultat = oppdaterMangelIBrev(mal, inkluderteDelmaler, valgfelt, variabler);

        if (harMangelResultat === 'HAR_MANGEL') {
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
            <Feilmelding>{feilmelding}</Feilmelding>
            <FeilmeldingBrev />
        </VStack>
    );
};

const FeilmeldingBrev = () => {
    const { manglendeBrevVariabler, manglendeValgfelt } = useBrevFeilContext();
    return (
        (manglendeBrevVariabler.size > 0 || manglendeValgfelt.size > 0) && (
            <Feilmelding variant="alert" size={'small'}>
                Kan ikke gå videre, følgende felter mangler fra brev:
                <ListeMedMangler
                    tittel={'Felt som mangler verdi'}
                    mangler={manglendeBrevVariabler}
                />
                <ListeMedMangler tittel={'Valg som mangler verdi'} mangler={manglendeValgfelt} />
            </Feilmelding>
        )
    );
};

const ListeMedMangler = ({
    tittel,
    mangler,
}: {
    tittel: string;
    mangler: Map<string, FeilIDelmalType[]>;
}) => {
    const alleMangler = [...mangler.values()].flat();
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
