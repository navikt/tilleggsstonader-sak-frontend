import React from 'react';

import { styled } from 'styled-components';

import { BodyShort, Heading, Tag } from '@navikt/ds-react';

import BehandlingTabell from './BehandlingTabell';
import OpprettNyBehandlingModal from './OpprettNyBehandling/OpprettNyBehandlingModal';
import { stønadstypeTilTekst } from '../../../typer/behandling/behandlingTema';
import { Fagsak } from '../../../typer/fagsak';
import { KlageBehandling } from '../../../typer/klage';
import { erProd } from '../../../utils/miljø';

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
    fagsak: Fagsak;
    klagebehandlinger: KlageBehandling[];
    hentKlagebehandlinger: () => void;
    hentBehandlinger: () => void;
}

export const FagsakOversikt: React.FC<Props> = ({
    fagsak,
    klagebehandlinger,
    hentKlagebehandlinger,
    hentBehandlinger,
}) => {
    return (
        <Container>
            <TittelLinje>
                <Heading size="small" level="3">
                    {stønadstypeTilTekst[fagsak.stønadstype]}
                </Heading>
                <BodyShort size="small">(Saksnummer: {fagsak.eksternId})</BodyShort>
                {fagsak.erLøpende && (
                    <Tag variant={'info'} size={'small'}>
                        Løpende
                    </Tag>
                )}
            </TittelLinje>
            <BehandlingTabell
                behandlinger={fagsak.behandlinger}
                klagebehandlinger={klagebehandlinger}
            />
            {!erProd() && (
                <OpprettNyBehandlingModal
                    fagsak={fagsak}
                    hentKlagebehandlinger={hentKlagebehandlinger}
                    hentBehandlinger={hentBehandlinger}
                />
            )}
        </Container>
    );
};
