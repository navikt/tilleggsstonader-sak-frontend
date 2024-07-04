import React, { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useApp } from '../../context/AppContext';
import { Feilmelding } from '../../komponenter/Feil/Feilmelding';
import { Behandling } from '../../typer/behandling/behandling';
import { RessursStatus } from '../../typer/ressurs';

/*
/* Brukes dersom du har en ekstern behandling-ID og vil rutes til behandlingen
*/
export const EksternOmrutingBehandling = () => {
    const navigate = useNavigate();
    const { request } = useApp();
    const { eksternBehandlingId } = useParams<{ eksternBehandlingId: string }>();

    const [feilmelding, settFeilmelding] = useState<string>();

    useEffect(() => {
        request<Behandling, null>(`/api/sak/behandling/ekstern/${eksternBehandlingId}`).then(
            (resultat) => {
                if (resultat.status === RessursStatus.SUKSESS) {
                    navigate(`/behandling/${resultat.data.id}`);
                } else {
                    settFeilmelding(resultat.frontendFeilmelding);
                }
            }
        );
    }, [eksternBehandlingId, navigate, request]);

    return <Feilmelding variant="alert">{feilmelding}</Feilmelding>;
};
