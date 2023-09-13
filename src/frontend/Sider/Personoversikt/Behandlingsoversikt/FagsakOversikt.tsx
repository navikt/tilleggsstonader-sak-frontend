import React from 'react';

import { styled } from 'styled-components';

import { BodyShort, Heading, Tag } from '@navikt/ds-react';

import BehandlingTabell from './BehandlingTabell';
import { Fagsak } from '../../../typer/fagsak';
import { formaterEnumVerdi } from '../../../utils/tekstformatering';

const TittelLinje = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

export const FagsakOversikt: React.FC<{ fagsak: Fagsak }> = ({ fagsak }) => {
    return (
        <>
            <TittelLinje>
                <Heading size="small" level="3">
                    Fagsak: {formaterEnumVerdi(fagsak.stønadstype)}
                </Heading>
                <BodyShort size="small">({fagsak.eksternId})</BodyShort>
                {fagsak.erLøpende && (
                    <Tag variant={'info'} size={'small'}>
                        Løpende
                    </Tag>
                )}
            </TittelLinje>
            <BehandlingTabell behandlinger={fagsak.behandlinger} />
        </>
    );
};
