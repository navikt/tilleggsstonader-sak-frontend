import React, { useEffect, useState } from 'react';

import { Heading, HStack, Select, VStack } from '@navikt/ds-react';

import { InformasjonOppfølging } from './InformasjonOppfølging';
import styles from './OppfølgingAdmin.module.css';
import { OppfølgingTabell } from './OppfølgingTabell';
import { Oppfølging } from './oppfølgingTyper';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import {
    Arkivtema,
    arkivtemaerTilTekst,
    finnArkivTemaSaksbehandlerHarTilgangTil,
} from '../../../typer/arkivtema';
import { byggHenterRessurs, Ressurs } from '../../../typer/ressurs';
import { erProd } from '../../../utils/miljø';

export const OppølgingAdmin = () => {
    const { request, saksbehandler, appEnv } = useApp();

    const [oppfølginger, settOppføginger] = useState<Ressurs<Oppfølging[]>>(byggHenterRessurs());
    const arkivtemaSaksbehandlerHarTilgangTil = finnArkivTemaSaksbehandlerHarTilgangTil(
        appEnv,
        saksbehandler
    );

    const [tema, settTema] = useState<Arkivtema>(arkivtemaSaksbehandlerHarTilgangTil[0]);

    const hentBehandlingerForOppfølging = () => {
        settOppføginger(byggHenterRessurs());
        request(`/api/sak/oppfolging/start/${tema}`, 'POST');
        setTimeout(() => {
            request<Oppfølging[], null>(`/api/sak/oppfolging/${tema}`).then(settOppføginger);
        }, 3000);
    }; // TODO Denne delayen bør gjøres på en bedre måte hvis vi skal gjøre dette tilgjengelig i prod

    useEffect(() => {
        request<Oppfølging[], null>(`/api/sak/oppfolging/${tema}`).then(settOppføginger);
    }, [request, tema]);

    return (
        <VStack gap={'space-16'} className={styles.container}>
            <Heading size={'medium'}>[Admin] Oppfølging</Heading>
            <InformasjonOppfølging />
            <HStack gap={'4'} className={styles.formContainer}>
                <Select
                    value={tema}
                    label="Tema"
                    onChange={(e) => settTema(e.target.value as Arkivtema)}
                    size="small"
                >
                    {arkivtemaSaksbehandlerHarTilgangTil.map((tema) => (
                        <option key={tema} value={tema}>
                            {arkivtemaerTilTekst[tema]}
                        </option>
                    ))}
                </Select>
                {!erProd() && (
                    <SmallButton onClick={hentBehandlingerForOppfølging}>
                        {'Hent behandlinger for oppfølging'}
                    </SmallButton>
                )}
            </HStack>

            <DataViewer type={'oppfølginger'} response={{ oppfølginger }}>
                {({ oppfølginger }) => <OppfølgingTabell oppfølgingerInit={oppfølginger} />}
            </DataViewer>
        </VStack>
    );
};
