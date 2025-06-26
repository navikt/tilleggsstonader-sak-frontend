import React from 'react';

import styled from 'styled-components';

import { PersonHeadsetIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';

import { StatusBar, utledStatusbarFarge } from './StatusBar';
import { useBehandling } from '../../context/BehandlingContext';
import { SaksbehandlerDto, SaksbehandlerRolle } from '../../typer/behandling/saksbehandlerDto';

export const PersonIkon = styled(PersonHeadsetIcon)`
    width: 3rem;
    height: 3rem;
`;

const TilordnetSaksbehandler: React.FC = () => {
    const { behandling } = useBehandling();

    if (!behandling.tilordnetSaksbehandler) {
        return;
    }

    const utledVisningsnavn = (ansvarligSaksbehandler: SaksbehandlerDto) => {
        switch (ansvarligSaksbehandler.rolle) {
            case SaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER:
            case SaksbehandlerRolle.OPPGAVE_FINNES_IKKE_SANNSYNLIGVIS_INNLOGGET_SAKSBEHANDLER:
            case SaksbehandlerRolle.ANNEN_SAKSBEHANDLER:
                return `${ansvarligSaksbehandler.fornavn} ${ansvarligSaksbehandler.etternavn}`;
            case SaksbehandlerRolle.UTVIKLER_MED_VEILDERROLLE:
                return 'ingen tilgang';
            default:
                return 'ingen ansvarlig';
        }
    };

    return (
        <>
            <HStack gap={'2'} align={'center'}>
                <PersonIkon />
                <div>
                    <BodyShort weight={'semibold'} size={'small'}>
                        Ansvarlig saksbehandler:
                    </BodyShort>
                    <BodyShort size={'small'}>
                        {utledVisningsnavn(behandling.tilordnetSaksbehandler)}
                    </BodyShort>
                </div>
            </HStack>
            <StatusBar $color={utledStatusbarFarge(behandling.tilordnetSaksbehandler.rolle)} />
        </>
    );
};

export default TilordnetSaksbehandler;
