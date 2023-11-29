import React from 'react';

import DataViewer from '../../../komponenter/DataViewer';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import Brevmeny from '../../Behandling/Brev/Brevmeny';
import useBrev from '../../Behandling/Brev/useBrev';
import VelgBrevmal from '../../Behandling/Brev/VelgBrevmal';

const FrittståendeBrev: React.FC<{ valgtStønadstype: Stønadstype }> = ({ valgtStønadstype }) => {
    const { brevmaler, brevmal, settBrevmal, malStruktur } = useBrev(
        valgtStønadstype,
        'FRITTSTAENDE'
    );

    return (
        <DataViewer response={{ brevmaler }}>
            {({ brevmaler }) => (
                <>
                    <VelgBrevmal
                        brevmaler={brevmaler}
                        brevmal={brevmal}
                        settBrevmal={settBrevmal}
                    />
                    <DataViewer response={{ malStruktur }}>
                        {({ malStruktur }) => <Brevmeny mal={malStruktur} />}
                    </DataViewer>
                </>
            )}
        </DataViewer>
    );
};

export default FrittståendeBrev;
