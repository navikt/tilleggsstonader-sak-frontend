import React from 'react';

import { styled } from 'styled-components';

import { BodyShort, Heading, Tag } from '@navikt/ds-react';

import BehandlingTabell from './BehandlingTabell';
import OpprettNyBehandlingModal from './OpprettNyBehandling/OpprettNyBehandlingModal';
import { FagsakMedBehandlinger } from '../../../typer/behandling/behandlingoversikt';
import { stønadstypeTilTekst } from '../../../typer/behandling/behandlingTema';
import { KlageBehandling } from '../../../typer/klage';
import {
    mapFagsakPersonTilTabellrader,
    mapKlagesakerTilTabellrader,
    sorterBehandlinger,
} from '../../../utils/behandlingutil';

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
    klagebehandlinger: KlageBehandling[];
    hentBehandlinger: () => void;
    hentKlagebehandlinger: () => void;
}

export const FagsakOversikt: React.FC<Props> = ({
    fagsakMedBehandlinger,
    klagebehandlinger,
    hentBehandlinger,
    hentKlagebehandlinger,
}) => {
    const { fagsakId, stønadstype, eksternFagsakId, erLøpende, behandlinger } =
        fagsakMedBehandlinger;

    const tabellbehandlinger = [
        ...mapFagsakPersonTilTabellrader(behandlinger),
        ...mapKlagesakerTilTabellrader(klagebehandlinger),
    ].sort(sorterBehandlinger);

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
