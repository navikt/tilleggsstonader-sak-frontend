import React, { useState } from 'react';

import { Box, VStack, Heading, HStack, Select, BodyLong } from '@navikt/ds-react';

import { Oppfølging } from './oppfølgingTyper';
import { useApp } from '../../../context/AppContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { Feil, feiletRessursTilFeilmelding } from '../../../komponenter/Feil/feilmeldingUtils';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';
import { Arkivtema, arkivtemaerTilTekst } from '../../../typer/arkivtema';
import { byggHenterRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';

export const OppdaterOppfølgingsliste: React.FC<{
    settOppfølginger: (value: React.SetStateAction<Ressurs<Oppfølging[]>>) => void;
    hentOppfølginger: () => void;
    tema: Arkivtema;
    settTema: (value: React.SetStateAction<Arkivtema>) => void;
    arkivtemaSaksbehandlerHarTilgangTil: Arkivtema[];
}> = ({
    hentOppfølginger,
    tema,
    settTema,
    arkivtemaSaksbehandlerHarTilgangTil,
    settOppfølginger,
}) => {
    const { request } = useApp();

    const [visModal, settVisModal] = useState(false);
    const [feil, settFeil] = useState<Feil | undefined>(undefined);

    const hentBehandlingerForOppfølging = () => {
        request(`/api/sak/oppfolging/start/${tema}`, 'POST')
            .then((resultat) => {
                if (resultat.status === RessursStatus.SUKSESS) {
                    lukkModal();
                } else {
                    settFeil(feiletRessursTilFeilmelding(resultat));
                }
            })
            .finally(() => {
                settOppfølginger(byggHenterRessurs());
                setTimeout(() => {
                    hentOppfølginger();
                }, 5000);
            });
    };

    const lukkModal = () => {
        settFeil(undefined);
        settVisModal(false);
    };

    return (
        <>
            <Box
                padding="space-16"
                background="info-soft"
                borderColor="info"
                borderWidth="1"
                borderRadius="12"
                width="fit-content"
            >
                <VStack gap="space-16">
                    <Heading size="small">Oppdater oppfølgingslista</Heading>
                    <HStack gap={'space-16'} align="end">
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
                        <SmallButton onClick={() => settVisModal(true)}>
                            Oppdater oppfølgingslista
                        </SmallButton>
                    </HStack>
                </VStack>
            </Box>
            <ModalWrapper
                visModal={visModal}
                onClose={lukkModal}
                tittel="Er du sikker på at du vil oppdatere oppfølgingslista?"
                umamiId="oppdater-oppfølging-modal"
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: hentBehandlingerForOppfølging,
                        tekst: 'Oppdater oppfølgingslista',
                    },
                    lukkKnapp: {
                        onClick: lukkModal,
                        tekst: 'Avbryt',
                    },
                }}
            >
                <BodyLong size="small" spacing>
                    Ved oppdatering av oppfølgingslista vil de eksisterende oppfølgingene bli
                    overskrevet. Pass på at andre saksbehandlere ikke jobber med oppfølgingene
                    samtidig, da det kan føre til at endringer går tapt.
                </BodyLong>
                <BodyLong size="small">
                    Oppdatering av oppfølgingslista kan ta flere minutter. For å få opp alle må du
                    laste inn siden på nytt (ikke trykk på oppdater-knappen igjen).
                </BodyLong>
                <Feilmelding feil={feil} />
            </ModalWrapper>
        </>
    );
};
