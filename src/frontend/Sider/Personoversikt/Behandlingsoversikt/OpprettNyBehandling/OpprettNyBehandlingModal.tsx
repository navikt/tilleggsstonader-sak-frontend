import React, { FC, useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { Button, Select, VStack } from '@navikt/ds-react';

import OpprettKlageBehandling from './OpprettKlageBehandling';
import OpprettRevurderingBehandling from './OpprettRevurderingBehandling';
import { useApp } from '../../../../context/AppContext';
import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import {
    BehandlingType,
    behandlingTypeTilTekst,
} from '../../../../typer/behandling/behandlingType';
import { Toggle } from '../../../../utils/toggles';

interface Props {
    fagsakId: string;
    stønadstype: Stønadstype;
    hentKlagebehandlinger: () => void;
    hentBehandlinger: () => void;
}

const OpprettNyBehandlingModal: FC<Props> = ({
    fagsakId,
    stønadstype,
    hentKlagebehandlinger,
    hentBehandlinger,
}) => {
    const { erSaksbehandler } = useApp();
    const [visModal, settVisModal] = useState(false);
    const [behandlingtype, settBehandlingtype] = useState<BehandlingType>();

    const kanOppretteRevurdering = useFlag(Toggle.KAN_OPPRETTE_REVURDERING);

    const lukkModal = () => {
        settVisModal(false);
        settBehandlingtype(undefined);
    };

    if (!erSaksbehandler) {
        return null;
    }
    if (!kanOppretteRevurdering) {
        return null;
    }

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
                        {[
                            ...(kanOppretteRevurdering ? [BehandlingType.REVURDERING] : []),
                            ...[BehandlingType.KLAGE],
                        ].map((type) => (
                            <option key={type} value={type}>
                                {behandlingTypeTilTekst[type]}
                            </option>
                        ))}
                    </Select>
                    {behandlingtype === BehandlingType.KLAGE && (
                        <OpprettKlageBehandling
                            fagsakId={fagsakId}
                            lukkModal={lukkModal}
                            hentKlagebehandlinger={hentKlagebehandlinger}
                        />
                    )}
                    {behandlingtype === BehandlingType.REVURDERING && (
                        <OpprettRevurderingBehandling
                            fagsakId={fagsakId}
                            stønadstype={stønadstype}
                            lukkModal={lukkModal}
                            hentBehandlinger={hentBehandlinger}
                        />
                    )}
                </VStack>
            </ModalWrapper>
        </div>
    );
};

export default OpprettNyBehandlingModal;
