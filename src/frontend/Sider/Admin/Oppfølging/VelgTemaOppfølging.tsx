import { FC, SetStateAction } from 'react';

import { Box, VStack, Select, BodyLong } from '@navikt/ds-react';

import { Arkivtema, arkivtemaerTilTekst } from '../../../typer/arkivtema';

export const VelgTemaOppfølging: FC<{
    tema: Arkivtema;
    settTema: (value: SetStateAction<Arkivtema>) => void;
    arkivtemaSaksbehandlerHarTilgangTil: Arkivtema[];
}> = ({ tema, settTema, arkivtemaSaksbehandlerHarTilgangTil }) => {
    return (
        <Box
            padding="space-16"
            background="info-soft"
            borderColor="info"
            borderWidth="1"
            borderRadius="12"
            width="fit-content"
        >
            <VStack gap="space-16">
                <BodyLong size="small">
                    Oppfølgingslista oppdateres automatisk hver søndag kveld.
                </BodyLong>
                <Select
                    value={tema}
                    label="Tema"
                    onChange={(e) => settTema(e.target.value as Arkivtema)}
                    size="small"
                >
                    {arkivtemaSaksbehandlerHarTilgangTil.map((tema) => (
                        <option key={tema} value={tema}>
                            {arkivtemaerTilTekst[tema]}
                        </option>
                    ))}
                </Select>
            </VStack>
        </Box>
    );
};
