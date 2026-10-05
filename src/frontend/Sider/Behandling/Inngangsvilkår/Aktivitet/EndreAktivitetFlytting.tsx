import React from 'react';

import { EndreAktivitetFlyttingTso } from './EndreAktivitetFlyttingTso';
import { EndreAktivitetFlyttingTsr } from './EndreAktivitetFlyttingTsr';
import { useBehandling } from '../../../../context/BehandlingContext';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { erAktivitetFlyttingTso, erAktivitetFlyttingTsr } from '../typer/vilkårperiode/aktivitet';
import {
    AktivitetFlyttingTso,
    AktivitetFlyttingTsr,
} from '../typer/vilkårperiode/aktivitetFlytting';

export const EndreAktivitetFlytting: React.FC<{
    aktivitet?: AktivitetFlyttingTso | AktivitetFlyttingTsr;
    aktivitetFraRegister?: Registeraktivitet;
    avbrytRedigering: () => void;
}> = ({ aktivitet, aktivitetFraRegister, avbrytRedigering }) => {
    const { behandling } = useBehandling();

    if (behandling.stønadstype === Stønadstype.FLYTTING_TSO) {
        return (
            <EndreAktivitetFlyttingTso
                aktivitet={erAktivitetFlyttingTso(aktivitet) ? aktivitet : undefined}
                aktivitetFraRegister={aktivitetFraRegister}
                avbrytRedigering={avbrytRedigering}
            />
        );
    }

    return (
        <EndreAktivitetFlyttingTsr
            aktivitet={erAktivitetFlyttingTsr(aktivitet) ? aktivitet : undefined}
            aktivitetFraRegister={aktivitetFraRegister}
            avbrytRedigering={avbrytRedigering}
        />
    );
};
