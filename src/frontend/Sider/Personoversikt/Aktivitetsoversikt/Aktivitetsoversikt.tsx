import React, { useEffect, useState } from 'react';

import Aktiviteter from './Aktiviteter';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { Registeraktivitet } from '../../../typer/registeraktivitet';
import { byggHenterRessurs, Ressurs } from '../../../typer/ressurs';

const Aktivitetsoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [aktiviteter, settAktiviteter] =
        useState<Ressurs<Registeraktivitet[]>>(byggHenterRessurs());

    useEffect(() => {
        request<Registeraktivitet[], null>(`/api/sak/aktivitet/${fagsakPersonId}`, 'GET').then(
            settAktiviteter
        );
    }, [request, fagsakPersonId]);

    return (
        <DataViewer response={{ aktiviteter }}>
            {({ aktiviteter }) => <Aktiviteter aktiviteter={aktiviteter} />}
        </DataViewer>
    );
};

export default Aktivitetsoversikt;
