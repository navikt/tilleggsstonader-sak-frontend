import React from 'react';

import { styled } from 'styled-components';

import { BodyShort, Heading, Tag } from '@navikt/ds-react';

import BehandlingTabell from './BehandlingTabell';
import OpprettNyBehandlingModal from './OpprettNyBehandling/OpprettNyBehandlingModal';
import { Stønadstype, stønadstypeTilTekst } from '../../../typer/behandling/behandlingTema';
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
    fagsakId: string;
    stønadstype: Stønadstype;
    fagsakEskternID: number;
    fagsakErLøpende: boolean;
    tabellbehandlinger: TabellBehandling[];
    hentBehandlinger: () => void;
    hentKlagebehandlinger: () => void;
}

export const FagsakOversikt: React.FC<Props> = ({
    fagsakId,
    stønadstype,
    fagsakEskternID,
    fagsakErLøpende,
    tabellbehandlinger,
    hentBehandlinger,
    hentKlagebehandlinger,
}) => {
    return (
        <Container>
            <TittelLinje>
                <Heading size="small" level="3">
                    {stønadstypeTilTekst[stønadstype]}
                </Heading>
                <BodyShort size="small">(Saksnummer: {fagsakEskternID})</BodyShort>
                {fagsakErLøpende && (
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
