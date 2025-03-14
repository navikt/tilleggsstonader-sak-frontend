import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Textarea } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { Feil, feiletRessursTilFeilmelding } from '../../../komponenter/Feil/feilmeldingUtils';
import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';
import { FlexColumn } from '../../../komponenter/Visningskomponenter/Flex';
import { RessursStatus } from '../../../typer/ressurs';

interface TaAvVentRequest {
    skalTilordnesRessurs: boolean;
    kommentar?: string;
}

const TaAvVentModal: React.FC<{
    visModal: boolean;
    skjulModal: () => void;
}> = ({ visModal, skjulModal }) => {
    const { request } = useApp();
    const { behandling, hentBehandling } = useBehandling();
    const navigate = useNavigate();

    const [kommentar, settKommentar] = useState('');
    const [feilmelding, settFeilmelding] = useState<Feil>();
    const [laster, settLaster] = useState(false);

    const taAvVent = (skalTilordnesRessurs: boolean) => {
        if (laster) return;
        settLaster(true);
        request<null, TaAvVentRequest>(`/api/sak/sett-pa-vent/${behandling.id}`, 'DELETE', {
            skalTilordnesRessurs: skalTilordnesRessurs,
            kommentar: kommentar,
        }).then((resp) => {
            if (resp.status === RessursStatus.SUKSESS) {
                if (skalTilordnesRessurs) {
                    hentBehandling.rerun();
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
            visModal={visModal}
            onClose={lukkModal}
            tittel="Ta behandling av vent"
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
