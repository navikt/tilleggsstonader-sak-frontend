import React, { useState } from 'react';

import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';
import { useApp } from '../../../context/AppContext';
import { RessursStatus } from '../../../typer/ressurs';
import { useBehandling } from '../../../context/BehandlingContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { FlexColumn } from '../../../komponenter/Visningskomponenter/Flex';
import { Textarea } from '@navikt/ds-react';

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

    const [kommentar, settKommentar] = useState('');
    const [feilmelding, settFeilmelding] = useState('');
    const [laster, settLaster] = useState(false);

    const taAvVent = () => {
        if (laster) return;
        settLaster(true);
        request<null, TaAvVentRequest>(`/api/sak/sett-pa-vent/${behandling.id}`, 'DELETE', {
            skalTilordnesRessurs: true,
            kommentar: kommentar,
        }).then((resp) => {
            if (resp.status === RessursStatus.SUKSESS) {
                hentBehandling.rerun();
            } else {
                settFeilmelding(resp.frontendFeilmelding);
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
                    onClick: taAvVent,
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
                <Feilmelding variant="alert">{feilmelding}</Feilmelding>
            </FlexColumn>
        </ModalWrapper>
    );
};

export default TaAvVentModal;
