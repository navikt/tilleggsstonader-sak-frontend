import React from 'react';

import { OppsummeringGruppe } from './OppsummeringGruppe';
import { OppsummeringAktiviteter, OppsummeringMålgrupper } from './VilkårOppsummeringRad';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVilkårperioder } from '../../../hooks/useVilkårperioder';
import DataViewer from '../../../komponenter/DataViewer';

export const OppsummeringVilkårperioder: React.FC = () => {
    const { behandling } = useBehandling();
    const { vilkårperioderResponse } = useVilkårperioder(behandling.id);

    return (
        <DataViewer response={{ vilkårperioderResponse }}>
            {({ vilkårperioderResponse }) => (
                <>
                    <OppsummeringGruppe tittel={'Aktivitet'}>
                        <OppsummeringAktiviteter
                            aktiviteter={vilkårperioderResponse.vilkårperioder.aktiviteter}
                        />
                    </OppsummeringGruppe>
                    <OppsummeringGruppe tittel={'Målgruppe'}>
                        <OppsummeringMålgrupper
                            målgrupper={vilkårperioderResponse.vilkårperioder.målgrupper}
                        />
                    </OppsummeringGruppe>
                </>
            )}
        </DataViewer>
    );
};
