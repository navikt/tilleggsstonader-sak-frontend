import React, { useState } from 'react';

import styled from 'styled-components';

import { Alert, BodyLong, Button, Heading, HStack, VStack } from '@navikt/ds-react';

import TaAvVentModal from './TaAvVentModal';
import { StatusSettPåVent, årsakTilTekst } from './typer';
import { useApp } from '../../context/AppContext';
import { useSettPåVent } from '../../context/SettPåVentContext';
import { RessursStatus } from '../../typer/ressurs';
import {
    formaterIsoDato,
    formaterNullableTilTekstligDato,
    formaterTilTekstligDato,
} from '../../utils/dato';
import { ModalWrapper } from '../Modal/ModalWrapper';

const Kommentar = styled(BodyLong)`
    white-space: pre-wrap;
`;

interface NullstillBehandlingAdvarselModalProps {
    settVisTaAvVentModal: (verdi: boolean) => void;
    settVisNullstillBehandlingAdvarselModal: (verdi: boolean) => void;
}

function NullstillBehandlingAdvarselModal({
    settVisNullstillBehandlingAdvarselModal,
    settVisTaAvVentModal,
}: NullstillBehandlingAdvarselModalProps) {
    return (
        <ModalWrapper
            visModal={true}
            tittel="Behandlingen nullstilles!"
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => {
                        settVisNullstillBehandlingAdvarselModal(false);
                        settVisTaAvVentModal(true);
                    },
                    tekst: 'Det er ok - nullstill behandling',
                },
                lukkKnapp: {
                    onClick: () => {
                        settVisNullstillBehandlingAdvarselModal(false);
                        settVisTaAvVentModal(false);
                    },
                    tekst: 'Avbryt',
                },
            }}
        >
            <BodyLong spacing>
                Ettersom det har blitt fattet et annet vedtak på denne fagsaken i tidsrommet denne
                behandlingen har vært på vent, er vi nødt til å tilbakestille eventuelle endringer
                som er gjort i denne behandlingen. Dette er fordi det forrige vedtaket kan påvirke
                behandlingen.
            </BodyLong>
            <BodyLong>
                Hvis du har lagt inn informasjon som du ønsker å ha med videre, må du velge
                &quot;Avbryt&quot;. Deretter kopierer du det du vil ta vare på før behandlingen tas
                av vent.
            </BodyLong>
        </ModalWrapper>
    );
}

const SettPåVentInformasjon: React.FC<{
    status: StatusSettPåVent;
    statusPåVentRedigering: boolean;
    settStatusPåVentRedigering: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ status, statusPåVentRedigering, settStatusPåVentRedigering }) => {
    const { request } = useApp();
    const { context, behandlingId } = useSettPåVent();
    const [visTaAvVentModal, settVisTaAvVentModal] = useState<boolean>(false);
    const [visNullstillBehandlingAdvarselModal, settVisNullstillBehandlingAdvarselModal] =
        useState<boolean>(false);
    const [kanIkkeTasAvVentFeilmelding, settKanIkkeTasAvVentFeilmelding] = useState<string>();

    const frist = status.frist ? formaterIsoDato(status.frist) : '';

    const datoSattPåVent = formaterTilTekstligDato(status.datoSattPåVent);

    type KanTaAvVentResponse = {
        resultat:
            | 'OK'
            | 'MÅ_NULLSTILLE_BEHANDLING'
            | 'ANNEN_AKTIV_BEHANDLING_PÅ_FAGSAKEN'
            | 'ER_IKKE_PÅ_VENT';
    };

    const håndterTaAvVent = () => {
        request<KanTaAvVentResponse, null>(
            `/api/${context}/sett-pa-vent/${behandlingId}/kan-ta-av-vent`
        ).then((resp) => {
            if (resp.status === RessursStatus.SUKSESS) {
                if (resp.data.resultat === 'OK') {
                    settVisTaAvVentModal(true);
                } else if (resp.data.resultat === 'MÅ_NULLSTILLE_BEHANDLING') {
                    settVisNullstillBehandlingAdvarselModal(true);
                } else if (resp.data.resultat === 'ANNEN_AKTIV_BEHANDLING_PÅ_FAGSAKEN') {
                    settKanIkkeTasAvVentFeilmelding(
                        'Det finnes allerede en aktiv behanding på denne fagsaken. Den må ferdigstilles eller settes på vent før denne behandlingen kan tas av vent.'
                    );
                } else if (resp.data.resultat === 'ER_IKKE_PÅ_VENT') {
                    settKanIkkeTasAvVentFeilmelding(
                        'Denne behandlingen er ikke på vent. Vennligst oppdater nettsiden.'
                    );
                }
            }
        });
    };

    return (
        <VStack gap={'4'}>
            <Heading size={'small'}>
                Satt på vent {datoSattPåVent} av {status.opprettetAv}
            </Heading>
            <VStack gap="2">
                {status.endretAv && (
                    <div>
                        <strong>Sist endret: </strong>
                        {formaterNullableTilTekstligDato(status.endretTid)} av {status.endretAv}
                    </div>
                )}
                <div>
                    <strong>Venter på: </strong>
                    {status.årsaker.map((årsak) => årsakTilTekst[årsak]).join(', ')}
                </div>
                <div>
                    <strong>Frist: </strong>
                    {frist}
                </div>
                <div>
                    <strong>Kommentar fra saksbehandler: </strong>
                    <Kommentar>{status.kommentar}</Kommentar>
                </div>
            </VStack>
            {!statusPåVentRedigering && (
                <HStack gap={'4'}>
                    <Button size={'small'} onClick={() => settStatusPåVentRedigering(true)}>
                        Oppdater
                    </Button>
                    <Button size={'small'} variant={'secondary'} onClick={håndterTaAvVent}>
                        Ta av vent
                    </Button>
                </HStack>
            )}
            {kanIkkeTasAvVentFeilmelding && (
                <Alert variant="warning">{kanIkkeTasAvVentFeilmelding}</Alert>
            )}
            {visNullstillBehandlingAdvarselModal && (
                <NullstillBehandlingAdvarselModal
                    settVisTaAvVentModal={settVisTaAvVentModal}
                    settVisNullstillBehandlingAdvarselModal={
                        settVisNullstillBehandlingAdvarselModal
                    }
                />
            )}
            {visTaAvVentModal && <TaAvVentModal skjulModal={() => settVisTaAvVentModal(false)} />}
        </VStack>
    );
};

export default SettPåVentInformasjon;
