import React, { useEffect, useState } from 'react';

import { Heading, HStack, Select, VStack } from '@navikt/ds-react';

import { InformasjonOppfølging } from './InformasjonOppfølging';
import styles from './OppfølgingAdmin.module.css';
import { OppfølgingTabell } from './OppfølgingTabell';
import { Oppfølging } from './oppfølgingTyper';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import { byggHenterRessurs, Ressurs } from '../../../typer/ressurs';
import { erProd } from '../../../utils/miljø';
import {
    Enheter,
    enhetTilTekst,
    hentEnheterSaksbehandlerHarTilgangTil,
} from '../../Oppgavebenk/typer/enhet';

export const OppølgingAdmin = () => {
    const { request, saksbehandler, appEnv } = useApp();

    const [oppfølginger, settOppføginger] = useState<Ressurs<Oppfølging[]>>(byggHenterRessurs());
    const gyldigeEnheterForSaksbehandler = hentEnheterSaksbehandlerHarTilgangTil(
        appEnv,
        saksbehandler
    );

    const [enhet, settEnhet] = useState<Enheter>(gyldigeEnheterForSaksbehandler[0]);

    const hentBehandlingerForOppfølging = () => {
        settOppføginger(byggHenterRessurs());
        request(`/api/sak/oppfolging/start/${enhet}`, 'POST');
        setTimeout(() => {
            request<Oppfølging[], null>(`/api/sak/oppfolging/${enhet}`).then(settOppføginger);
        }, 3000);
    }; // TODO Denne delayen bør gjøres på en bedre måte hvis vi skal gjøre dette tilgjengelig i prod

    useEffect(() => {
        request<Oppfølging[], null>(`/api/sak/oppfolging/${enhet}`).then(settOppføginger);
    }, [request, enhet]);

    return (
        <VStack gap={'4'} className={styles.container}>
            <Heading size={'medium'}>[Admin] Oppfølging</Heading>
            <InformasjonOppfølging />
            {!erProd() && (
                <HStack gap={'4'} className={styles.formContainer}>
                    <Select
                        value={enhet}
                        label="Enhet"
                        onChange={(e) => settEnhet(e.target.value as Enheter)}
                        size="small"
                    >
                        {gyldigeEnheterForSaksbehandler.map((enhet) => (
                            <option key={enhet} value={enhet}>
                                {enhetTilTekst[enhet]}
                            </option>
                        ))}
                    </Select>
                    <SmallButton onClick={hentBehandlingerForOppfølging}>
                        {'Hent behandlinger for oppfølging'}
                    </SmallButton>
                </HStack>
            )}
            <DataViewer type={'oppfølginger'} response={{ oppfølginger }}>
                {({ oppfølginger }) => <OppfølgingTabell oppfølgingerInit={oppfølginger} />}
            </DataViewer>
        </VStack>
    );
};
