import React, { useEffect, useState } from 'react';

import { Heading, VStack } from '@navikt/ds-react';

import { InformasjonOppfølging } from './InformasjonOppfølging';
import styles from './OppfølgingAdmin.module.css';
import { OppfølgingTabell } from './OppfølgingTabell';
import { Oppfølging } from './oppfølgingTyper';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import { byggHenterRessurs, Ressurs } from '../../../typer/ressurs';

export const OppølgingAdmin = () => {
    const { request } = useApp();

    const [oppfølginger, settOppføginger] = useState<Ressurs<Oppfølging[]>>(byggHenterRessurs());

    const hentBehandlingerForOppfølging = () => {
        settOppføginger(byggHenterRessurs());
        request(`/api/sak/oppfolging/start`, 'POST');
        setTimeout(() => {
            request<Oppfølging[], null>(`/api/sak/oppfolging`).then(settOppføginger);
        }, 3000);
    };

    useEffect(() => {
        request<Oppfølging[], null>(`/api/sak/oppfolging`).then(settOppføginger);
    }, [request]);

    return (
        <VStack gap={'space-16'} className={styles.container}>
            <Heading size={'medium'}>[Admin] Oppfølging</Heading>
            <InformasjonOppfølging />
            <div>
                <SmallButton onClick={hentBehandlingerForOppfølging}>
                    {'Hent behandlinger for oppfølging'}
                </SmallButton>
            </div>
            <DataViewer type={'oppfølginger'} response={{ oppfølginger }}>
                {({ oppfølginger }) => <OppfølgingTabell oppfølgingerInit={oppfølginger} />}
            </DataViewer>
        </VStack>
    );
};
