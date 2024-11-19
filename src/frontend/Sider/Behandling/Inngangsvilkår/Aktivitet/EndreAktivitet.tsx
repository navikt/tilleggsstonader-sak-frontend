import React from 'react';

import { EndreAktivitetFelles } from './EndreAktivitetFelles';
import { EndreAktivitetLæremidler } from './EndreAktivitetLæremidler';
import {
    finnBegrunnelseGrunnerAktivitetBarnetilsyn,
    nyAktivitetBarnetilsyn,
    resettAktivitetBarnetilsyn,
} from './utilsBarnetilsyn';
import {
    finnBegrunnelseGrunnerAktivitetLæremidler,
    nyAktivitetLæremidler,
    resettAktivitetLæremidler,
} from './utilsLæremidler';
import { validerAktivitetBarnetilsyn } from './valideringAktivitetBarnetilsyn';
import { validerAktivitetLæremidler } from './valideringAktivitetLæremidler';
import { useBehandling } from '../../../../context/BehandlingContext';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import {
    Aktivitet,
    AktivitetLæremidler,
    AktivitetLæremidlerNyttFormat,
    DelvilkårAktivitetLæremidler,
    FaktaOgVurderingerLæremidler,
    mapAktivitetBarnetilsynNyToBarnetilsyn,
    mapAktivitetLæremidlerNyToLæremidler,
    mapTilAktivitetLæremidlerNy,
} from '../typer/aktivitet';

export const EndreAktivitet: React.FC<{
    aktivitet?: Aktivitet;
    aktivitetFraRegister?: Registeraktivitet;
    avbrytRedigering: () => void;
}> = ({ aktivitet, aktivitetFraRegister, avbrytRedigering }) => {
    const { behandling } = useBehandling();
    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN:
            return (
                <EndreAktivitetFelles
                    avbrytRedigering={avbrytRedigering}
                    nyAktivitet={nyAktivitetBarnetilsyn}
                    validerAktivitet={validerAktivitetBarnetilsyn}
                    resettAktivitet={resettAktivitetBarnetilsyn}
                    finnBegrunnelsesGrunner={finnBegrunnelseGrunnerAktivitetBarnetilsyn}
                    mapNyTilGammel={mapAktivitetBarnetilsynNyToBarnetilsyn}
                />
            );
        case Stønadstype.LÆREMIDLER:
            return (
                <EndreAktivitetFelles<
                    FaktaOgVurderingerLæremidler,
                    AktivitetLæremidlerNyttFormat,
                    DelvilkårAktivitetLæremidler
                >
                    avbrytRedigering={avbrytRedigering}
                    nyAktivitet={nyAktivitetLæremidler}
                    validerAktivitet={validerAktivitetLæremidler}
                    resettAktivitet={resettAktivitetLæremidler}
                    finnBegrunnelsesGrunner={finnBegrunnelseGrunnerAktivitetLæremidler}
                    mapNyTilGammel={mapAktivitetLæremidlerNyToLæremidler}
                />
            );

            return (
                <EndreAktivitetLæremidler
                    aktivitet={mapTilAktivitetLæremidlerNy(aktivitet as AktivitetLæremidler)}
                    aktivitetFraRegister={aktivitetFraRegister}
                    avbrytRedigering={avbrytRedigering}
                />
            );
    }
};
