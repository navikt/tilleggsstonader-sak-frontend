import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { styled } from 'styled-components';

import { BodyShort, Heading, Tag } from '@navikt/ds-react';

import BehandlingTabell, { TabellBehandling } from './BehandlingTabell';
import OpprettNyBehandlingModal from './OpprettNyBehandling/OpprettNyBehandlingModal';
import { Stønadstype, stønadstypeTilTekst } from '../../../typer/behandling/behandlingTema';
import { Toggle } from '../../../utils/toggles';

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
    const kanOppretteKlage = useFlag(Toggle.KAN_OPPRETTE_KLAGE);

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
            {kanOppretteKlage && (
                <OpprettNyBehandlingModal
                    fagsakId={fagsakId}
                    hentKlagebehandlinger={hentKlagebehandlinger}
                    hentBehandlinger={hentBehandlinger}
                />
            )}
        </Container>
    );
};
