import React, { FC, useState } from 'react';

import styled from 'styled-components';

import { Button, Select, VStack } from '@navikt/ds-react';

import OpprettKlageBehandling from './OpprettKlageBehandling';
import {
    OpprettNyBehandlingType,
    opprettNyBehandlingTypeTilTekst,
} from './OpprettNyBehandlingUtils';
import OpprettOrdinærBehandling from './OpprettOrdinærBehandling';
import { useApp } from '../../../../context/AppContext';
import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';

interface Props {
    fagsakId: string;
    stønadstype: Stønadstype;
    hentKlagebehandlinger: () => void;
    hentBehandlinger: () => void;
}

const StyledContainer = styled.div`
    margin-left: 10px;
    margin-bottom: 14px;
`;

const OpprettNyBehandlingModal: FC<Props> = ({
    fagsakId,
    stønadstype,
    hentKlagebehandlinger,
    hentBehandlinger,
}) => {
    const { erSaksbehandler } = useApp();
    const [visModal, settVisModal] = useState(false);
    const [opprettNyBehandlingType, settOpprettNyBehandlingType] =
        useState<OpprettNyBehandlingType>();

    const lukkModal = () => {
        settVisModal(false);
        settOpprettNyBehandlingType(undefined);
    };

    if (!erSaksbehandler) {
        return null;
    }

    return (
        <StyledContainer className="py-16">
            <Button size={'small'} variant={'secondary'} onClick={() => settVisModal(true)}>
                Opprett ny behandling
            </Button>
            <ModalWrapper visModal={visModal} onClose={lukkModal} tittel={'Opprett ny behandling'}>
                <VStack gap="4">
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
                        {[
                            OpprettNyBehandlingType.ORDINAER_BEHANDLING,
                            OpprettNyBehandlingType.KLAGE,
                        ].map((type) => (
                            <option key={type} value={type}>
                                {opprettNyBehandlingTypeTilTekst[type]}
                            </option>
                        ))}
                    </Select>
                    {opprettNyBehandlingType === OpprettNyBehandlingType.KLAGE && (
                        <OpprettKlageBehandling
                            fagsakId={fagsakId}
                            lukkModal={lukkModal}
                            hentKlagebehandlinger={hentKlagebehandlinger}
                        />
                    )}
                    {opprettNyBehandlingType === OpprettNyBehandlingType.ORDINAER_BEHANDLING && (
                        <OpprettOrdinærBehandling
                            fagsakId={fagsakId}
                            stønadstype={stønadstype}
                            lukkModal={lukkModal}
                            hentBehandlinger={hentBehandlinger}
                        />
                    )}
                </VStack>
            </ModalWrapper>
        </StyledContainer>
    );
};

export default OpprettNyBehandlingModal;
