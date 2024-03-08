import React, { useState } from 'react';

import styled from 'styled-components';

import { BodyLong, Button, Heading, HStack, VStack } from '@navikt/ds-react';

import { StatusSettPåVent, årsakTilTekst } from './typer';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { RessursStatus } from '../../../typer/ressurs';
import { formaterIsoDato } from '../../../utils/dato';

const Beskrivelse = styled(BodyLong)`
    white-space: pre-wrap;
`;
const SettPåVentInformasjon: React.FC<{ status: StatusSettPåVent }> = ({ status }) => {
    const { request } = useApp();
    const { behandling, hentBehandling } = useBehandling();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const { statusPåVentRedigering, settStatusPåVentRedigering } = useBehandling();
    const frist = status.frist ? formaterIsoDato(status.frist) : '';

    const taAvVent = () => {
        if (laster) return;
        settLaster(true);
        request<null, null>(`/api/sak/sett-pa-vent/${behandling.id}`, 'DELETE').then((resp) => {
            if (resp.status === RessursStatus.SUKSESS) {
                hentBehandling.rerun();
            } else {
                settFeilmelding(resp.frontendFeilmelding);
            }
        });
    };

    return (
        <VStack gap={'4'}>
            <Heading size={'medium'}>Sett behandling på vent {frist}</Heading>
            <div>
                <strong>Venter på: </strong>
                {status.årsaker.map((årsak) => årsakTilTekst[årsak]).join(', ')}
            </div>
            <div>
                <strong>Kommentar: </strong>
                <Beskrivelse>{status.kommentar}</Beskrivelse>
            </div>
            {!statusPåVentRedigering && (
                <HStack gap={'4'}>
                    <Button size={'small'} onClick={() => settStatusPåVentRedigering(true)}>
                        Oppdater
                    </Button>
                    <Button size={'small'} variant={'secondary'} onClick={taAvVent}>
                        Ta av vent
                    </Button>
                </HStack>
            )}
            <Feilmelding>{feilmelding}</Feilmelding>
        </VStack>
    );
};

export default SettPåVentInformasjon;
