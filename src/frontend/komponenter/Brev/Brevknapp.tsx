import { useState } from 'react';
import React from 'react';

import styled from 'styled-components';

import { BodyShort, Button, List, Textarea, VStack } from '@navikt/ds-react';

import { MalStruktur, Valg, Valgfelt } from './typer';
import { FeilIDelmal, FeilIDelmalType, useBrevFeilContext } from '../../context/BrevFeilContext';
import { Feilmelding } from '../Feil/Feilmelding';

const Knapp = styled(Button)`
    display: block;
    max-width: fit-content;
`;

interface Props {
    tittel: string;
    onClick: (kommentarTilBeslutter: string | undefined) => Promise<void>;

    mal: MalStruktur;
    inkluderteDelmaler: Record<string, boolean>;
    valgfelt: Partial<Record<string, Record<Valgfelt['_id'], Valg>>>;
    variabler: Partial<Record<string, string>>;
    kanSendeKommentarTilBeslutter?: boolean;
}

export const Brevknapp = ({
    tittel,
    onClick,
    mal,
    inkluderteDelmaler,
    valgfelt,
    variabler,
    kanSendeKommentarTilBeslutter = false,
}: Props) => {
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [kommentarTilBeslutter, settKommentarTilBeslutter] = useState<string>();
    const { oppdaterMangelIBrev } = useBrevFeilContext();

    const trykkPåKnapp = () => {
        settFeilmelding(undefined);

        const harMangelResultat = oppdaterMangelIBrev(mal, inkluderteDelmaler, valgfelt, variabler);

        if (harMangelResultat === 'HAR_MANGEL') {
            return;
        }

        settLaster(true);

        onClick(kommentarTilBeslutter)
            .catch((error) =>
                settFeilmelding(error instanceof Error ? error.message : String(error))
            )
            .finally(() => settLaster(false));
    };

    return (
        <VStack gap={'2'}>
            {kanSendeKommentarTilBeslutter && (
                <Textarea
                    label="Kommentar til beslutter"
                    description="Skal kun brukes til intern dialog med beslutter. Endelige vurderinger skal skrives i respektive begrunnelsesfelt."
                    value={kommentarTilBeslutter}
                    onChange={(e) => settKommentarTilBeslutter(e.target.value)}
                    style={{ maxWidth: '400px' }}
                />
            )}
            <Knapp onClick={trykkPåKnapp} disabled={laster} size="small">
                {tittel}
            </Knapp>
            <Feilmelding feil={feilmelding} />
            <FeilmeldingBrev />
        </VStack>
    );
};

const FeilmeldingBrev = () => {
    const { manglendeBrevVariabler, manglendeValgfelt } = useBrevFeilContext();
    return (
        (manglendeBrevVariabler.length > 0 || manglendeValgfelt.length > 0) && (
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
    mangler: FeilIDelmal<FeilIDelmalType>[];
}) => {
    const alleMangler = mangler.flatMap((delmal) => delmal.mangler);
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
