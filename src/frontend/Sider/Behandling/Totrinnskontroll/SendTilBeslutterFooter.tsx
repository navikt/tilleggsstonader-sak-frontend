import * as React from 'react';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@navikt/ds-react';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../typer/ressurs';

const Footer = styled.footer`
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: ${ABorderStrong};
`;

const MidtstiltInnhold = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-right: 50%;
`;

const HovedKnapp = styled(Button)`
    margin-left: 1rem;
    margin-right: 1rem;
`;

const SendTilBeslutterFooter: React.FC = () => {
    const { request } = useApp();
    const navigate = useNavigate();
    const { behandling, hentBehandling, behandlingErRedigerbar } = useBehandling();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [visModal, settVisModal] = useState<boolean>(false);
    const behandlingId = behandling.id;
    const sendTilBeslutter = () => {
        settLaster(true);
        settFeilmelding(undefined);
        request<string, null>(
            `/api/sak/totrinnskontroll/${behandlingId}/send-til-beslutter`,
            'POST'
        )
            .then((res: RessursSuksess<string> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    //hentTotrinnskontroll.rerun(); // TODO håndter henting i totrinnskontroll-komponenten
                    settVisModal(true);
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                }
            })
            .finally(() => settLaster(false));
    };

    const lukkModal = () => {
        settVisModal(false);
        hentBehandling.rerun();
        //hentBehandlingshistorikk.rerun(); // TODO behandlingshistorikk
    };

    return (
        <>
            {behandlingErRedigerbar && (
                <Footer>
                    <Feilmelding>{feilmelding}</Feilmelding>
                    <MidtstiltInnhold>
                        <HovedKnapp onClick={sendTilBeslutter} disabled={laster} type={'button'}>
                            Ferdigstill behandling
                        </HovedKnapp>
                    </MidtstiltInnhold>
                </Footer>
            )}
            <ModalWrapper
                tittel={'Vedtaket er ferdigstilt'}
                visModal={visModal}
                onClose={() => settVisModal(false)}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: () => navigate('/'),
                        tekst: 'Til oppgavebenk',
                    },
                    lukkKnapp: {
                        onClick: () => lukkModal(),
                        tekst: 'Lukk',
                    },
                    marginTop: 4,
                }}
            />
        </>
    );
};

export default SendTilBeslutterFooter;
