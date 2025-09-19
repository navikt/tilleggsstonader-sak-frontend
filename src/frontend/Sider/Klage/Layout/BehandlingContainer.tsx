import * as React from 'react';
import { FC, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { BorderFocus } from '@navikt/ds-tokens/darkside-js';

import BehandlingRoutes from './BehandlingRoutes';
import Fanemeny from './Fanemeny/Fanemeny';
import { Høyremeny } from './Høyremeny/Høyremeny';
import { Statusheader } from './Statusheader/Statusheader';
import { useRerunnableEffect } from '../../../hooks/useRerunnableEffect';
import DataViewer from '../../../komponenter/DataViewer';
import ScrollToTop from '../../../komponenter/ScrollToTop/ScrollToTop';
import { SettPåVentKlage } from '../../../komponenter/SettPåVent/SettPåVentContainer';
import { KlagebehandlingProvider, useKlagebehandling } from '../context/KlagebehandlingContext';
import { useHentKlagebehandling } from '../hooks/useHentKlagebehandling';
import { useHentPersonopplysninger } from '../hooks/useHentPersonopplysninger';
import { useSetPersonIdent } from '../hooks/useSetPersonIdent';
import { useSetValgtFagsakId } from '../hooks/useSetValgtFagsakId';
import { HenleggModal } from '../Komponenter/HenleggModal/HenleggModal';

const Container = styled.div`
    display: flex;
    flex-shrink: 2;

    > * {
        padding-bottom: 64px;
    }
`;

interface HøyreMenyWrapperProps {
    $åpenHøyremeny: boolean;
}

const HøyreMenyWrapper = styled.div<HøyreMenyWrapperProps>`
    border-left: 2px solid ${BorderFocus};
    flex-shrink: 1;
    flex-grow: 0;
    width: ${(p) => (p.$åpenHøyremeny ? '20rem' : '1.5rem')};
    min-width: ${(p) => (p.$åpenHøyremeny ? '20rem' : '1.5rem')};
    transition: all 0.25s;
`;

interface InnholdWrapperProps {
    $åpenHøyremeny: boolean;
}

const InnholdWrapper = styled.div<InnholdWrapperProps>`
    flex-shrink: 0;
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    max-width: ${(p) => (p.$åpenHøyremeny ? 'calc(100% - 20rem)' : '100%')};
    z-index: 9;
`;

const BehandlingContainer: FC = () => {
    const behandlingId = useParams<{ behandlingId: string }>().behandlingId as string;

    useEffect(() => {
        document.title = 'Klagebehandling';
    }, []);

    const { hentBehandlingCallback, behandling } = useHentKlagebehandling(behandlingId);
    const hentBehandling = useRerunnableEffect(hentBehandlingCallback, [behandlingId]);

    const { hentPersonopplysninger, personopplysninger } = useHentPersonopplysninger(behandlingId);

    // eslint-disable-next-line
    useEffect(() => hentPersonopplysninger(behandlingId), [behandlingId]);
    return (
        <DataViewer type={'behandlingsinformasjon'} response={{ behandling, personopplysninger }}>
            {({ behandling, personopplysninger }) => (
                <KlagebehandlingProvider
                    behandling={behandling}
                    hentBehandling={hentBehandling}
                    personopplysninger={personopplysninger}
                >
                    <BehandlingContent />
                </KlagebehandlingProvider>
            )}
        </DataViewer>
    );
};

const BehandlingContent = () => {
    const { behandling, personopplysninger } = useKlagebehandling();
    useSetValgtFagsakId(behandling.fagsakId);
    useSetPersonIdent(personopplysninger.personIdent);
    const { åpenHøyremeny } = useKlagebehandling();

    return (
        <>
            <ScrollToTop />
            <Statusheader personopplysninger={personopplysninger} behandling={behandling} />
            <Container>
                <InnholdWrapper $åpenHøyremeny={åpenHøyremeny}>
                    <Fanemeny behandling={behandling} />
                    <SettPåVentKlage />
                    <BehandlingRoutes behandling={behandling} />
                    <HenleggModal behandling={behandling} />
                </InnholdWrapper>
                <HøyreMenyWrapper $åpenHøyremeny={åpenHøyremeny}>
                    <Høyremeny åpenHøyremeny={åpenHøyremeny} behandling={behandling} />
                </HøyreMenyWrapper>
            </Container>
        </>
    );
};

export default BehandlingContainer;
