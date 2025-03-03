import React from 'react';

import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, Tag } from '@navikt/ds-react';

import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { useSteg } from '../../../../context/StegContext';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { Aktivitet } from '../typer/vilkårperiode/aktivitet';
import { kanRegisterperiodeBrukes } from '../Vilkårperioder/vilkårperiodeUtil';

const erAktivitetLagtTil = (aktiviteter: Aktivitet[], registerAktivitet: Registeraktivitet) =>
    aktiviteter.some((aktivitet) => registerAktivitet.id === aktivitet.kildeId);

export function BrukAktivitetKnapp({
    registerAktivitet,
    leggTilAktivitetFraRegister,
}: {
    registerAktivitet: Registeraktivitet;
    leggTilAktivitetFraRegister: (registerAktivitet: Registeraktivitet) => void;
}) {
    const { aktiviteter } = useInngangsvilkår();
    const { erStegRedigerbart } = useSteg();
    const { behandling } = useBehandling();

    const harBruktAktivitet = erAktivitetLagtTil(aktiviteter, registerAktivitet);
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
