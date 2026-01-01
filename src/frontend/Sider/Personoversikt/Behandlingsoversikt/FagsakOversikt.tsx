import React from 'react';

import { BodyShort, Heading, Tag } from '@navikt/ds-react';

import BehandlingTabell from './BehandlingTabell';
import styles from './FagsakOversikt.module.css';
import { OpprettNyBehandlingModal } from './OpprettNyBehandling/OpprettNyBehandlingModal';
import { FagsakMedBehandlinger } from '../../../typer/behandling/behandlingoversikt';
import { stønadstypeTilTekst } from '../../../typer/behandling/behandlingTema';
import { KlageBehandling } from '../../../typer/klage';
import {
    mapFagsakPersonTilTabellrader,
    mapKlagesakerTilTabellrader,
    sorterBehandlinger,
} from '../../../utils/behandlingutil';

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
        <div className={styles.container}>
            <div className={styles.tittelLinje}>
                <Heading size="small" level="3">
                    {stønadstypeTilTekst[stønadstype]}
                </Heading>
                <BodyShort size="small">(Saksnummer: {eksternFagsakId})</BodyShort>
                {erLøpende && (
                    <Tag variant={'info'} size={'small'}>
                        Løpende
                    </Tag>
                )}
            </div>
            <BehandlingTabell tabellbehandlinger={tabellbehandlinger} />
            <OpprettNyBehandlingModal
                fagsakId={fagsakId}
                stønadstype={stønadstype}
                hentKlagebehandlinger={hentKlagebehandlinger}
                hentBehandlinger={hentBehandlinger}
            />
        </div>
    );
};
