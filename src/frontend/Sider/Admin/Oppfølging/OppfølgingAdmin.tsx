import React, { useCallback, useEffect, useState } from 'react';

import { Heading, VStack } from '@navikt/ds-react';

import { OppdaterOppfølgingsliste } from './OppdaterOppfølgingsliste';
import styles from './OppfølgingAdmin.module.css';
import { OppfølgingTabell } from './OppfølgingTabell';
import { Oppfølging } from './oppfølgingTyper';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { Arkivtema, finnArkivTemaSaksbehandlerHarTilgangTil } from '../../../typer/arkivtema';
import { byggHenterRessurs, Ressurs } from '../../../typer/ressurs';

export const OppølgingAdmin = () => {
    const { request, saksbehandler, appEnv } = useApp();

    const [oppfølginger, settOppfølginger] = useState<Ressurs<Oppfølging[]>>(byggHenterRessurs());

    const arkivtemaSaksbehandlerHarTilgangTil = finnArkivTemaSaksbehandlerHarTilgangTil(
        appEnv,
        saksbehandler
    );

    const [tema, settTema] = useState<Arkivtema>(arkivtemaSaksbehandlerHarTilgangTil[0]);

    const hentOppfølginger = useCallback(() => {
        settOppfølginger(byggHenterRessurs());
        request<Oppfølging[], null>(`/api/sak/oppfolging/${tema}`).then(settOppfølginger);
    }, [request, settOppfølginger, tema]);

    useEffect(() => {
        hentOppfølginger();
    }, [hentOppfølginger]);

    return (
        <VStack gap={'space-32'} className={styles.container}>
            <Heading size={'medium'}>[Admin] Oppfølging</Heading>
            <OppdaterOppfølgingsliste
                settOppfølginger={settOppfølginger}
                hentOppfølginger={hentOppfølginger}
                tema={tema}
                settTema={settTema}
                arkivtemaSaksbehandlerHarTilgangTil={arkivtemaSaksbehandlerHarTilgangTil}
            />
            <DataViewer type={'oppfølginger'} response={{ oppfølginger }}>
                {({ oppfølginger }) => (
                    <OppfølgingTabell
                        key={oppfølginger[0]?.opprettetTidspunkt ?? 'empty'}
                        oppfølgingerInit={oppfølginger}
                    />
                )}
            </DataViewer>
        </VStack>
    );
};
