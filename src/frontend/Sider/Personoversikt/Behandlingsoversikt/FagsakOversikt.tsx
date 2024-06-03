import React from 'react';

import { styled } from 'styled-components';

import { BodyShort, Heading, Tag } from '@navikt/ds-react';

import BehandlingTabell from './BehandlingTabell';
import OpprettNyBehandlingModal from './OpprettNyBehandling/OpprettNyBehandlingModal';
import { stønadstypeTilTekst } from '../../../typer/behandling/behandlingTema';
import { Fagsak } from '../../../typer/fagsak';
import { erProd } from '../../../utils/miljø';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const TittelLinje = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

export const FagsakOversikt: React.FC<{ fagsak: Fagsak }> = ({ fagsak }) => {
    return (
        <Container>
            <TittelLinje>
                <Heading size="small" level="3">
                    Fagsak: {stønadstypeTilTekst[fagsak.stønadstype]}
                </Heading>
                <BodyShort size="small">({fagsak.eksternId})</BodyShort>
                {fagsak.erLøpende && (
                    <Tag variant={'info'} size={'small'}>
                        Løpende
                    </Tag>
                )}
            </TittelLinje>
            <BehandlingTabell behandlinger={fagsak.behandlinger} />
            {!erProd() && <OpprettNyBehandlingModal fagsak={fagsak} />}
        </Container>
    );
};
