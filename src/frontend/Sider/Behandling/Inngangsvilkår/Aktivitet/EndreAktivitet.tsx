import React from 'react';

import { EndreAktivitetBarnetilsyn } from './EndreAktivitetBarnetilsyn';
import { EndreAktivitetLæremidler } from './EndreAktivitetLæremidler';
import { useBehandling } from '../../../../context/BehandlingContext';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { Aktivitet, AktivitetBarnetilsyn, AktivitetLæremidler } from '../typer/aktivitet';

export const EndreAktivitet: React.FC<{
    aktivitet?: Aktivitet;
    aktivitetFraRegister?: Registeraktivitet;
    avbrytRedigering: () => void;
}> = ({ aktivitet, aktivitetFraRegister, avbrytRedigering }) => {
    const { behandling } = useBehandling();
    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN:
            return (
                <EndreAktivitetBarnetilsyn
                    aktivitet={aktivitet as AktivitetBarnetilsyn}
                    aktivitetFraRegister={aktivitetFraRegister}
                    avbrytRedigering={avbrytRedigering}
                />
            );
        case Stønadstype.LÆREMIDLER:
            return (
                <EndreAktivitetLæremidler
                    aktivitet={aktivitet as AktivitetLæremidler}
                    aktivitetFraRegister={aktivitetFraRegister}
                    avbrytRedigering={avbrytRedigering}
                />
            );
    }
};
