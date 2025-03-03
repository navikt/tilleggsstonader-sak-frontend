import React from 'react';

import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, Tag } from '@navikt/ds-react';

import { useBehandling } from '../../../../context/BehandlingContext';
import { useSteg } from '../../../../context/StegContext';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { kanRegisterperiodeBrukes } from '../Vilkårperioder/vilkårperiodeUtil';

export function BrukAktivitetKnapp({
    registerAktivitet,
    leggTilAktivitetFraRegister,
    harBruktAktivitet,
}: {
    registerAktivitet: Registeraktivitet;
    leggTilAktivitetFraRegister: (registerAktivitet: Registeraktivitet) => void;
    harBruktAktivitet: boolean;
}) {
    const { erStegRedigerbart } = useSteg();
    const { behandling } = useBehandling();

    const aktivitetKanBrukes = kanRegisterperiodeBrukes(registerAktivitet, behandling.revurderFra);

    if (harBruktAktivitet) {
        return (
            <Tag
                size="small"
                variant="neutral"
                icon={<CheckmarkIcon />}
                style={{ maxWidth: 'fit-content', background: 'transparent', border: 'none' }}
            >
                Brukt
            </Tag>
        );
    } else if (erStegRedigerbart && aktivitetKanBrukes) {
        return (
            <Button size="xsmall" onClick={() => leggTilAktivitetFraRegister(registerAktivitet)}>
                Bruk
            </Button>
        );
    } else {
        return null;
    }
}
