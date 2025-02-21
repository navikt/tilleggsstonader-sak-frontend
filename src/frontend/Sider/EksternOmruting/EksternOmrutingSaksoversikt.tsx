import React, { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useApp } from '../../context/AppContext';
import { Feilmelding } from '../../komponenter/Feil/Feilmelding';
import { Søkeresultat } from '../../komponenter/PersonSøk';
import { RessursStatus } from '../../typer/ressurs';

/*
/* Brukes dersom du har en ekstern fagsak-ID og vil rutes til relatert personoversikt/saksoversikt
*/
export const EksternOmrutingSaksoversikt = () => {
    const navigate = useNavigate();
    const { request } = useApp();
    const { eksternFagsakId } = useParams<{ eksternFagsakId: string }>();

    const [feilmelding, settFeilmelding] = useState<string>();

    useEffect(() => {
        request<Søkeresultat, null>(`/api/sak/sok/person/fagsak-ekstern/${eksternFagsakId}`).then(
            (resultat) => {
                if (resultat.status === RessursStatus.SUKSESS) {
                    navigate(`/person/${resultat.data.fagsakPersonId}`);
                } else {
                    settFeilmelding(resultat.frontendFeilmelding);
                }
            }
        );
    }, [eksternFagsakId, navigate, request]);

    return <Feilmelding feil={feilmelding} />;
};
