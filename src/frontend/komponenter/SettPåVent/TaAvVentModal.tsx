import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Textarea } from '@navikt/ds-react';

import { settPåVentContextTilUrlContext } from './typer';
import { useApp } from '../../context/AppContext';
import { useSettPåVent } from '../../context/SettPåVentContext';
import { RessursStatus } from '../../typer/ressurs';
import { Feilmelding } from '../Feil/Feilmelding';
import { Feil, feiletRessursTilFeilmelding } from '../Feil/feilmeldingUtils';
import { ModalWrapper } from '../Modal/ModalWrapper';
import { FlexColumn } from '../Visningskomponenter/FlexColumn';

interface TaAvVentRequest {
    skalTilordnesRessurs: boolean;
    kommentar?: string;
}

const TaAvVentModal: React.FC<{
    skjulModal: () => void;
}> = ({ skjulModal }) => {
    const { request } = useApp();
    const { context, behandlingId } = useSettPåVent();
    const navigate = useNavigate();

    const [kommentar, settKommentar] = useState('');
    const [feilmelding, settFeilmelding] = useState<Feil>();
    const [laster, settLaster] = useState(false);

    const taAvVent = (skalTilordnesRessurs: boolean) => {
        if (laster) return;
        settLaster(true);
        request<null, TaAvVentRequest>(
            `/api/${settPåVentContextTilUrlContext[context]}/sett-pa-vent/${behandlingId}`,
            'DELETE',
            {
                skalTilordnesRessurs: skalTilordnesRessurs,
                kommentar: kommentar,
            }
        ).then((resp) => {
            if (resp.status === RessursStatus.SUKSESS) {
                if (skalTilordnesRessurs) {
                    // TODO - fungerer ikke med 'hentBehandling.rerun();' da man må laste inn vilkår og
                    window.location.reload();
                } else {
                    navigate('/');
                }
            } else {
                settFeilmelding(feiletRessursTilFeilmelding(resp));
            }
        });
    };

    const lukkModal = () => {
        settKommentar('');
        skjulModal();
        settLaster(false);
    };

    return (
        <ModalWrapper
            visModal={true}
            onClose={lukkModal}
            tittel="Ta behandling av vent"
            umamiId={'ta-behandlinge-av-avent'}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => taAvVent(false),
                    tekst: 'Sett som klar og ufordelt',
                },
                sekundærKnapp: {
                    onClick: () => taAvVent(true),
                    tekst: 'Tildel meg og start behandling',
                },
                lukkKnapp: {
                    onClick: lukkModal,
                    tekst: 'Angre',
                },
            }}
        >
            <FlexColumn>
                <Textarea
                    label="Kommentar (valgfri)"
                    description="Forklar gjerne hvorfor saken tas av vent."
                    value={kommentar}
                    onChange={(e) => settKommentar(e.target.value)}
                />
                <Feilmelding feil={feilmelding} />
            </FlexColumn>
        </ModalWrapper>
    );
};

export default TaAvVentModal;
