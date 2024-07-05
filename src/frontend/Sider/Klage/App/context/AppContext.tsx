import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';

import { håndterFeil, håndterRessurs, preferredAxios } from '../api/axios';
import constate from 'constate';
import { EToast } from '../typer/toast';
import { AxiosRequestCallback } from '../typer/axiosRequest';
import { Ressurs, RessursFeilet, RessursSuksess } from '../../../../typer/ressurs';
import { AppEnv } from '../../../../utils/env';
interface IProps {
    appEnv: AppEnv;
}

const [AppProvider, useApp] = constate(({ appEnv }: IProps) => {
    const [autentisert, settAutentisert] = React.useState(true);
    const [ikkePersisterteKomponenter, settIkkePersisterteKomponenter] = useState<Set<string>>(
        new Set()
    );
    const [ulagretData, settUlagretData] = useState<boolean>(ikkePersisterteKomponenter.size > 0);
    const [valgtSide, settValgtSide] = useState<string | undefined>();
    const [visUlagretDataModal, settVisUlagretDataModal] = useState(false);
    const [byttUrl, settByttUrl] = useState(false);
    const [toast, settToast] = useState<EToast | undefined>();
    const [valgtFagsakId, settValgtFagsakId] = useState<string>();
    const [personIdent, settPersonIdent] = useState<string>();
    const [visBrevmottakereModal, settVisBrevmottakereModal] = useState(false);

    useEffect(
        () => settUlagretData(ikkePersisterteKomponenter.size > 0),
        [ikkePersisterteKomponenter]
    );

    const settIkkePersistertKomponent = (komponentId: string) => {
        if (ikkePersisterteKomponenter.has(komponentId)) return;

        settIkkePersisterteKomponenter(new Set(ikkePersisterteKomponenter).add(komponentId));
    };

    const nullstillIkkePersistertKomponent = (komponentId: string) => {
        const kopi = new Set(ikkePersisterteKomponenter);
        kopi.delete(komponentId);
        settIkkePersisterteKomponenter(kopi);
    };

    const nullstillIkkePersisterteKomponenter = () => {
        settIkkePersisterteKomponenter(new Set());
    };

    const gåTilUrl = (url: string) => {
        if (ulagretData) {
            settValgtSide(url);
            settVisUlagretDataModal(true);
        } else {
            settValgtSide(url);
            settByttUrl(true);
        }
    };

    const axiosRequest: AxiosRequestCallback = useCallback(
        <RES, REQ>(
            config: AxiosRequestConfig<REQ>
        ): Promise<RessursFeilet | RessursSuksess<RES>> => {
            return preferredAxios
                .request<Ressurs<RES>>(config)
                .then((response: AxiosResponse<Ressurs<RES>>) => {
                    const responsRessurs: Ressurs<RES> = response.data;
                    return håndterRessurs(responsRessurs, response.headers);
                })
                .catch((error: AxiosError<Ressurs<RES>>) => {
                    console.log('Axios Error');
                    if (error.message.includes('401')) {
                        settAutentisert(false);
                    }
                    return håndterFeil(error);
                });
        },
        []
    );

    return {
        axiosRequest,
        autentisert,
        settIkkePersistertKomponent,
        nullstillIkkePersistertKomponent,
        nullstillIkkePersisterteKomponenter,
        gåTilUrl,
        valgtSide,
        visUlagretDataModal,
        settVisUlagretDataModal,
        byttUrl,
        settByttUrl,
        toast,
        settToast,
        appEnv,
        valgtFagsakId,
        settValgtFagsakId,
        visBrevmottakereModal,
        settVisBrevmottakereModal,
        personIdent,
        settPersonIdent,
    };
});

export { AppProvider, useApp };
