import React from 'react';

import { EndreMålgruppeGenerelt } from './EndreMålgruppeGenerell';
import { EndreMålgruppeLæremidler } from './EndreMålgruppeLæremidler';
import { useBehandling } from '../../../../context/BehandlingContext';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { PeriodeYtelseRegister } from '../../../../typer/registerytelser';
import { Målgruppe } from '../typer/vilkårperiode/målgruppe';

export const EndreMålgruppe: React.FC<{
    målgruppe?: Målgruppe;
    registerYtelsePeriode?: PeriodeYtelseRegister;
    avbrytRedigering: () => void;
}> = ({ målgruppe, registerYtelsePeriode, avbrytRedigering }) => {
    const { behandling } = useBehandling();
    switch (behandling.stønadstype) {
        case Stønadstype.LÆREMIDLER:
            return (
                <EndreMålgruppeLæremidler
                    målgruppe={målgruppe}
                    registerYtelsePeriode={registerYtelsePeriode}
                    avbrytRedigering={avbrytRedigering}
                />
            );
        default:
            return (
                <EndreMålgruppeGenerelt
                    målgruppe={målgruppe}
                    registerYtelsePeriode={registerYtelsePeriode}
                    avbrytRedigering={avbrytRedigering}
                />
            );
    }
};
