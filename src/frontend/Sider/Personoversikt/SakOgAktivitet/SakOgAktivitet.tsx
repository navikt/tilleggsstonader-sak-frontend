import React, { useEffect, useState } from 'react';

import Aktiviteter from './Aktiviteter';
import { Aktivitet } from './typer';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { byggHenterRessurs, Ressurs } from '../../../typer/ressurs';

const SakOgAktivitet: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [aktiviteter, settAktiviteter] = useState<Ressurs<Aktivitet[]>>(byggHenterRessurs());

    useEffect(() => {
        request<Aktivitet[], null>(`/api/sak/aktivitet/${fagsakPersonId}`, 'GET').then(
            settAktiviteter
        );
    }, [request, fagsakPersonId]);

    return (
        <DataViewer response={{ aktiviteter }}>
            {({ aktiviteter }) => (
                <>
                    <Aktiviteter aktiviteter={aktiviteter} />
                </>
            )}
        </DataViewer>
    );
};

export default SakOgAktivitet;
