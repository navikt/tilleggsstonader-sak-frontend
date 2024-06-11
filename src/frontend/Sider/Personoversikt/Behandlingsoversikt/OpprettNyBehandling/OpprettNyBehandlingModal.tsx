import React, { FC, useState } from 'react';

import { Button, Select, VStack } from '@navikt/ds-react';

import OpprettKlageBehandling from './OpprettKlageBehandling';
import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';
import {
    BehandlingType,
    behandlingTypeTilTekst,
} from '../../../../typer/behandling/behandlingType';
import { Fagsak } from '../../../../typer/fagsak';

interface Props {
    fagsak: Fagsak;
    hentKlagebehandlinger: () => void;
}

const OpprettNyBehandlingModal: FC<Props> = ({ fagsak, hentKlagebehandlinger }) => {
    const [visModal, settVisModal] = useState(false);
    const [behandlingtype, settBehandlingtype] = useState<BehandlingType>();

    const lukkModal = () => {
        settVisModal(false);
        settBehandlingtype(undefined);
    };

    return (
        <div className="py-16">
            <Button variant={'secondary'} onClick={() => settVisModal(true)}>
                Opprett ny behandling
            </Button>
            <ModalWrapper visModal={visModal} onClose={lukkModal} tittel={'Opprett ny behandling'}>
                <VStack gap="4">
                    <Select
                        value={behandlingtype}
                        label="Behandlingstype"
                        onChange={(event) => {
                            settBehandlingtype(event.target.value as BehandlingType);
                        }}
                    >
                        <option value={''}>Velg</option>
                        <option value="KLAGE">
                            {behandlingTypeTilTekst[BehandlingType.KLAGE]}
                        </option>
                    </Select>
                    {behandlingtype === BehandlingType.KLAGE && (
                        <OpprettKlageBehandling
                            fagsak={fagsak}
                            lukkModal={lukkModal}
                            hentKlagebehandlinger={hentKlagebehandlinger}
                        />
                    )}
                </VStack>
            </ModalWrapper>
        </div>
    );
};

export default OpprettNyBehandlingModal;
