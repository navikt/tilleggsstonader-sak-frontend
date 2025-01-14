import * as React from 'react';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@navikt/ds-react';

import { TotrinnskontrollResponse } from './typer';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { useManglendeBrevVariabler } from '../../../context/ManglendeBrevVariablerContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../typer/ressurs';

const Knapp = styled(Button)`
    display: block;
`;

const SendTilBeslutterKnapp: React.FC = () => {
    const { request } = useApp();
    const navigate = useNavigate();
    const { behandling, hentBehandling, behandlingErRedigerbar } = useBehandling();
    const { manglendeBrevVariabler } = useManglendeBrevVariabler();
    const { brevMalManglerVariabler } = useManglendeBrevVariabler();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [visModal, settVisModal] = useState<boolean>(false);
    const behandlingId = behandling.id;
    const sendTilBeslutter = () => {
        settLaster(true);
        settFeilmelding(undefined);
        request<TotrinnskontrollResponse, null>(
            `/api/sak/totrinnskontroll/${behandlingId}/send-til-beslutter`,
            'POST'
        )
            .then((res: RessursSuksess<TotrinnskontrollResponse> | RessursFeilet) => {
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
                <>
                    <Knapp
                        onClick={sendTilBeslutter}
                        disabled={laster || brevMalManglerVariabler()}
                        type={'button'}
                        size="small"
                    >
                        Send til beslutter
                    </Knapp>
                    <Feilmelding variant="alert">{feilmelding}</Feilmelding>
                    {brevMalManglerVariabler() && (
                        <Feilmelding variant="alert">
                            <>
                                <p>Mangler følgende brevkomponenter:</p>
                                {manglendeBrevVariabler.map((manglendeKomponent) => (
                                    <p key={manglendeKomponent}>{manglendeKomponent}]</p>
                                ))}
                            </>
                        </Feilmelding>
                    )}
                </>
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
                }}
            />
        </>
    );
};

export default SendTilBeslutterKnapp;
