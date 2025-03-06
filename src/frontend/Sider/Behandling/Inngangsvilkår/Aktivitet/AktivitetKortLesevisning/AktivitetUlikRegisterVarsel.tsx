import React from 'react';

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Tag, VStack } from '@navikt/ds-react';

import { finnForskjellerMellomAktivitetOgRegisteraktivitet } from './aktivitetKortUtils';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { BehandlingStatus } from '../../../../../typer/behandling/behandlingStatus';
import { Registeraktivitet } from '../../../../../typer/registeraktivitet';
import { Aktivitet } from '../../typer/vilkårperiode/aktivitet';

export const AktivitetUlikRegisterVarsel: React.FC<{
    aktivitet: Aktivitet;
    aktivitetFraRegister: Registeraktivitet | undefined;
}> = ({ aktivitet, aktivitetFraRegister }) => {
    const { behandling } = useBehandling();
    if (behandling.status === BehandlingStatus.FERDIGSTILT || !aktivitetFraRegister) return null;

    const forskjeller = finnForskjellerMellomAktivitetOgRegisteraktivitet(
        aktivitet,
        aktivitetFraRegister
    );

    if (forskjeller.length > 0) {
        return (
            <VStack gap="4">
                <Tag
                    icon={<ExclamationmarkTriangleIcon />}
                    size="small"
                    variant="warning"
                    style={{ alignSelf: 'start' }}
                >
                    Opplysninger om aktivitet som er ulik Arena: {forskjeller.join(', ')}
                </Tag>
            </VStack>
        );
    }

    return null;
};
