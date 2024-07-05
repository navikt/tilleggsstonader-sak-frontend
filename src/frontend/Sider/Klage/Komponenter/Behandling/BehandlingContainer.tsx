import * as React from 'react';
import { FC, useEffect } from 'react';

import Høyremeny from './Høyremeny/Høyremeny';
import styled from 'styled-components';

import Fanemeny from './Fanemeny/Fanemeny';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';
import BehandlingRoutes from './BehandlingRoutes';
import { KlagebehandlingProvider, useKlagebehandling } from '../../App/context/KlagebehandlingContext';
import VisittkortComponent from '../../Felles/Visittkort/Visittkort';
import { Klagebehandling } from '../../App/typer/klagebehandling/klagebehandling';
import { Personopplysninger } from '../../App/typer/personopplysninger';
import ScrollToTop from '../../../../komponenter/ScrollToTop/ScrollToTop';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { HenleggModal } from './Henleggelse/HenleggModal';
import { useSetPersonIdent } from '../../App/hooks/useSetPersonIdent';
import { useSetValgtFagsakId } from '../../App/hooks/useSetValgtFagsakId';

const Container = styled.div`
    display: flex;
    flex-shrink: 2;
`;

interface InnholdWrapperProps {
    åpenHøyremeny: boolean;
}

interface HøyreMenyWrapperProps {
    åpenHøyremeny: boolean;
}

const HøyreMenyWrapper = styled.div<HøyreMenyWrapperProps>`
    border-left: 2px solid ${ABorderStrong};
    flex-shrink: 1;
    flex-grow: 0;
    width: ${(p) => (p.åpenHøyremeny ? '20rem' : '1.5rem')};
    min-width: ${(p) => (p.åpenHøyremeny ? '20rem' : '1.5rem')};
    transition: all 0.25s;
`;

const InnholdWrapper = styled.div<InnholdWrapperProps>`
    flex-shrink: 0;
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    max-width: ${(p) => (p.åpenHøyremeny ? 'calc(100% - 20rem)' : '100%')};
    z-index: 9;
`;

const BehandlingContainer: FC = () => {
    return (
        <KlagebehandlingProvider>
            <BehandlingOverbygg />
        </KlagebehandlingProvider>
    );
};

const BehandlingContent: FC<{
    behandling: Klagebehandling;
    personopplysninger: Personopplysninger;
}> = ({
    behandling,
    personopplysninger,
}) => {
    useSetValgtFagsakId(behandling.fagsakId);
    useSetPersonIdent(personopplysninger.personIdent);
    const { åpenHøyremeny } = useKlagebehandling();

    return (
        <>
            <ScrollToTop />
            <VisittkortComponent
                personopplysninger={personopplysninger}
                behandling={behandling}
            />
            <Container>
                <InnholdWrapper åpenHøyremeny={åpenHøyremeny}>
                    <Fanemeny behandling={behandling} />
                    <BehandlingRoutes behandling={behandling} />
                    <HenleggModal behandling={behandling} />
                </InnholdWrapper>
                <HøyreMenyWrapper åpenHøyremeny={åpenHøyremeny}>
                    <Høyremeny åpenHøyremeny={åpenHøyremeny} behandling={behandling} />
                </HøyreMenyWrapper>
            </Container>
        </>
    );
};

const BehandlingOverbygg: FC = () => {
    const {
        personopplysningerResponse,
        behandling
    } = useKlagebehandling();

    useEffect(() => {
        document.title = 'Klagebehandling';
    }, []);

    return (
        <DataViewer
            response={{
                behandling,
                personopplysningerResponse,
            }}
        >
            {({
                behandling,
                personopplysningerResponse,
            }) => (
                <BehandlingContent
                    behandling={behandling}
                    personopplysninger={personopplysningerResponse}
                />
            )}
        </DataViewer>
    );
};

export default BehandlingContainer;
