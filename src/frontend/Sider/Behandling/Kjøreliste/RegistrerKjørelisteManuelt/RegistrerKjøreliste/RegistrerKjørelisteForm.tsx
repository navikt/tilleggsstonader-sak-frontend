import React, { FC, useState } from 'react';

import {
    Alert,
    Box,
    Button,
    Heading,
    HStack,
    Select,
    Textarea,
    TextField,
    VStack,
} from '@navikt/ds-react';

import { RegistrerKjørelisteUke } from './RegistrerKjørelisteUke';
import { UkeTilInnsending } from './typer';
import { initialiserUkerTilInnsending, tilManuellKjørelisteRequest } from './utils';
import { validerRegistrerKjøreliste } from './validerRegistrerKjøreliste';
import { useApp } from '../../../../../context/AppContext';
import { useRegistrerKjøreliste } from '../../../../../context/RegistrerKjørelisteContext/RegistrerKjørelisteContext';
import { UlagretKomponent } from '../../../../../hooks/useUlagredeKomponenter';
import { Feilmelding } from '../../../../../komponenter/Feil/Feilmelding';
import {
    Feil,
    feiletRessursTilFeilmelding,
} from '../../../../../komponenter/Feil/feilmeldingUtils';
import { RessursStatus } from '../../../../../typer/ressurs';
import { erEtterDagensDato, formaterIsoPeriode } from '../../../../../utils/dato';
import { harVerdi } from '../../../../../utils/utils';

export const RegistrerKjørelisteForm: FC<{
    lukkSkjema: () => void;
}> = ({ lukkSkjema }) => {
    const { tilgjengeligeReiser, lagreKjøreliste } = useRegistrerKjøreliste();
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();

    const [valgtReiseId, settValgtReiseId] = useState<string>('');
    const [journalpostId, settJournalpostId] = useState<string>('');
    const [begrunnelse, settBegrunnelse] = useState<string>('');
    const [uker, settUker] = useState<UkeTilInnsending[]>([]);
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<Feil | string | undefined>(undefined);

    const velgReise = (reiseId: string) => {
        settValgtReiseId(reiseId);
        settJournalpostId('');
        settBegrunnelse('');
        settUlagretKomponent(UlagretKomponent.MANUELL_KJØRELISTE);

        const valgtReise = tilgjengeligeReiser.find((reise) => reise.reiseId === reiseId);
        settUker(valgtReise ? initialiserUkerTilInnsending(valgtReise.uker) : []);
    };

    const valgtReise = tilgjengeligeReiser.find((reise) => reise.reiseId === valgtReiseId);
    const reiseStarterFremITid =
        uker.length === 0 && valgtReise !== undefined && erEtterDagensDato(valgtReise.fom);

    const oppdaterUke = (oppdatertUke: UkeTilInnsending) => {
        settUker((prev) => prev.map((uke) => (uke.fom === oppdatertUke.fom ? oppdatertUke : uke)));
    };

    const valider = () => {
        const valideringsfeil = validerRegistrerKjøreliste(valgtReiseId, uker, journalpostId);
        settFeilmelding(valideringsfeil);

        return !valideringsfeil;
    };

    const lagre = () => {
        if (laster) {
            return;
        }

        if (!valider()) return;

        settLaster(true);

        lagreKjøreliste(
            tilManuellKjørelisteRequest(valgtReiseId, journalpostId, begrunnelse, uker)
        ).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                nullstillUlagretKomponent(UlagretKomponent.MANUELL_KJØRELISTE);
                lukkSkjema();
            } else {
                settFeilmelding(feiletRessursTilFeilmelding(res));
                settLaster(false);
            }
        });
    };

    const avbrytRedigering = () => {
        nullstillUlagretKomponent(UlagretKomponent.MANUELL_KJØRELISTE);
        lukkSkjema();
    };

    return (
        <Box
            padding="space-24"
            background="info-soft"
            borderColor="info-strong"
            borderRadius="12"
            borderWidth="1"
        >
            <VStack gap="space-24" align="start">
                <Heading size="small">Registrer kjøreliste manuelt</Heading>
                <Select
                    label="Velg reise du ønsker å registrere kjøreliste for"
                    value={valgtReiseId}
                    onChange={(e) => velgReise(e.target.value)}
                    size="small"
                >
                    <option value="">Velg reise</option>
                    {tilgjengeligeReiser.map((reise) => (
                        <option key={reise.reiseId} value={reise.reiseId}>
                            {reise.aktivitetsadresse} ({formaterIsoPeriode(reise.fom, reise.tom)})
                        </option>
                    ))}
                </Select>
                {harVerdi(valgtReiseId) &&
                    (reiseStarterFremITid ? (
                        <Alert variant="info" size="small">
                            Reisen starter frem i tid, det er derfor ingen tilgjengelige uker å
                            registrere enda.
                        </Alert>
                    ) : (
                        <>
                            <TextField
                                label="Journalpost ID"
                                size="small"
                                value={journalpostId}
                                onChange={(e) => settJournalpostId(e.target.value)}
                            />
                            <VStack gap="space-16">
                                <Heading size="xsmall">
                                    Huk av og fyll ut ukene du ønsker å registrere
                                </Heading>
                                {uker.map((uke) => (
                                    <RegistrerKjørelisteUke
                                        key={uke.fom}
                                        uke={uke}
                                        oppdaterUke={oppdaterUke}
                                    />
                                ))}
                            </VStack>
                            <Textarea
                                label="Begrunnelse"
                                description="Hvorfor fylles kjøreliste inn av saksbehandler?"
                                size="small"
                                minRows={3}
                                value={begrunnelse}
                                onChange={(e) => settBegrunnelse(e.target.value)}
                                resize
                            />
                        </>
                    ))}
                {!reiseStarterFremITid && <Feilmelding feil={feilmelding} />}
                <HStack gap="space-8">
                    <Button size="small" onClick={lagre} loading={laster}>
                        Lagre
                    </Button>
                    <Button size="small" onClick={avbrytRedigering} variant="tertiary">
                        Avbryt
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};
