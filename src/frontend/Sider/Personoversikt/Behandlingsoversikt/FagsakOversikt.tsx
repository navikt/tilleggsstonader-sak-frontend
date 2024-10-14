import React from 'react';

import { styled } from 'styled-components';

import { BodyShort, Heading, Tag } from '@navikt/ds-react';

import BehandlingTabell from './BehandlingTabell';
import OpprettNyBehandlingModal from './OpprettNyBehandling/OpprettNyBehandlingModal';
import { FagsakMedBehandlinger } from '../../../typer/behandling/behandlingoversikt';
import { stønadstypeTilTekst } from '../../../typer/behandling/behandlingTema';
import { TabellBehandling } from '../../../utils/behandlingutil';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const TittelLinje = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
`;

interface Props {
    fagsakMedBehandlinger: FagsakMedBehandlinger;
    tabellbehandlinger: TabellBehandling[];
    hentBehandlinger: () => void;
    hentKlagebehandlinger: () => void;
}

export const FagsakOversikt: React.FC<Props> = ({
    fagsakMedBehandlinger,
    tabellbehandlinger,
    hentBehandlinger,
    hentKlagebehandlinger,
}) => {
    const { fagsakId, stønadstype, eksternFagsakId, erLøpende } = fagsakMedBehandlinger;
    return (
        <Container>
            <TittelLinje>
                <Heading size="small" level="3">
                    {stønadstypeTilTekst[stønadstype]}
                </Heading>
                <BodyShort size="small">(Saksnummer: {eksternFagsakId})</BodyShort>
                {erLøpende && (
                    <Tag variant={'info'} size={'small'}>
                        Løpende
                    </Tag>
                )}
            </TittelLinje>
            <BehandlingTabell
                tabellbehandlinger={tabellbehandlinger}
                hentBehandlinger={hentBehandlinger}
            />
            <OpprettNyBehandlingModal
                fagsakId={fagsakId}
                stønadstype={stønadstype}
                hentKlagebehandlinger={hentKlagebehandlinger}
                hentBehandlinger={hentBehandlinger}
            />
        </Container>
    );
};
