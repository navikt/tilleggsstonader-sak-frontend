import React, { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useApp } from '../../context/AppContext';
import { Feilmelding } from '../../komponenter/Feil/Feilmelding';
import { Feil, feiletRessursTilFeilmelding } from '../../komponenter/Feil/feilmeldingUtils';
import { RessursStatus } from '../../typer/ressurs';

/*
/* Brukes dersom du har en ekstern behandling-ID og vil rutes til behandlingen
*/
export const EksternOmrutingBehandling = () => {
    const navigate = useNavigate();
    const { request } = useApp();
    const { eksternBehandlingId } = useParams<{ eksternBehandlingId: string }>();

    const [feilmelding, settFeilmelding] = useState<Feil>();

    useEffect(() => {
        request<string, null>(`/api/sak/behandling/ekstern/${eksternBehandlingId}`).then(
            (resultat) => {
                if (resultat.status === RessursStatus.SUKSESS) {
                    navigate(`/behandling/${resultat.data}`);
                } else {
                    settFeilmelding(feiletRessursTilFeilmelding(resultat));
                }
            }
        );
    }, [eksternBehandlingId, navigate, request]);

    return <Feilmelding feil={feilmelding} />;
};
