import React, { FC, useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { Button, Select, VStack } from '@navikt/ds-react';

import OpprettKjørelisteBehandling from './OpprettKjørelisteBehandling';
import OpprettKlageBehandling from './OpprettKlageBehandling';
import styles from './OpprettNyBehandlingModal.module.css';
import {
    OpprettNyBehandlingType,
    opprettNyBehandlingTypeTilTekst,
} from './OpprettNyBehandlingUtils';
import OpprettOrdinærBehandling from './OpprettOrdinærBehandling';
import { useApp } from '../../../../context/AppContext';
import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';
import { Stønadstype, stønadstypeErDagligReise } from '../../../../typer/behandling/behandlingTema';
import { Toggle } from '../../../../utils/toggles';

interface Props {
    fagsakId: string;
    stønadstype: Stønadstype;
    hentKlagebehandlinger: () => void;
    hentBehandlinger: () => void;
}
export const OpprettNyBehandlingModal: FC<Props> = ({
    fagsakId,
    stønadstype,
    hentKlagebehandlinger,
    hentBehandlinger,
}) => {
    const { erSaksbehandler } = useApp();
    const kanBehandleManuellKjørelistebehandling = useFlag(
        Toggle.KAN_OPPRETTE_MANUELL_KJØRELISTEBEHANDLING
    );

    const [visModal, settVisModal] = useState(false);
    const [opprettNyBehandlingType, settOpprettNyBehandlingType] =
        useState<OpprettNyBehandlingType>();

    function lukkModal() {
        settVisModal(false);
        settOpprettNyBehandlingType(undefined);
    }

    if (!erSaksbehandler) {
        return null;
    }

    const kanOppretteManuellKjørelisteBehandling =
        stønadstypeErDagligReise(stønadstype) && kanBehandleManuellKjørelistebehandling;

    const tilgjengeligeBehandlingstyper = [
        OpprettNyBehandlingType.ORDINAER_BEHANDLING,
        ...(kanOppretteManuellKjørelisteBehandling ? [OpprettNyBehandlingType.KJØRELISTE] : []),
        OpprettNyBehandlingType.KLAGE,
    ];

    const tittel = 'Opprett ny behandling';

    return (
        <div className={styles.container}>
            <Button size={'small'} variant={'secondary'} onClick={() => settVisModal(true)}>
                {tittel}
            </Button>
            <ModalWrapper
                visModal={visModal}
                onClose={lukkModal}
                tittel={tittel}
                umamiId={'opprett-ny-behandling'}
            >
                <VStack gap="space-16" className={styles.modalBody}>
                    <Select
                        value={opprettNyBehandlingType}
                        label="Behandlingstype"
                        onChange={(event) => {
                            settOpprettNyBehandlingType(
                                event.target.value as OpprettNyBehandlingType
                            );
                        }}
                    >
                        <option value={''}>Velg</option>
                        {tilgjengeligeBehandlingstyper.map((type) => (
                            <option key={type} value={type}>
                                {opprettNyBehandlingTypeTilTekst[type]}
                            </option>
                        ))}
                    </Select>
                    {opprettNyBehandlingType === OpprettNyBehandlingType.ORDINAER_BEHANDLING && (
                        <OpprettOrdinærBehandling
                            fagsakId={fagsakId}
                            stønadstype={stønadstype}
                            lukkModal={lukkModal}
                            hentBehandlinger={hentBehandlinger}
                        />
                    )}
                    {opprettNyBehandlingType === OpprettNyBehandlingType.KJØRELISTE && (
                        <OpprettKjørelisteBehandling
                            fagsakId={fagsakId}
                            lukkModal={lukkModal}
                            hentBehandlinger={hentBehandlinger}
                        />
                    )}
                    {opprettNyBehandlingType === OpprettNyBehandlingType.KLAGE && (
                        <OpprettKlageBehandling
                            fagsakId={fagsakId}
                            lukkModal={lukkModal}
                            hentKlagebehandlinger={hentKlagebehandlinger}
                        />
                    )}
                </VStack>
            </ModalWrapper>
        </div>
    );
};
