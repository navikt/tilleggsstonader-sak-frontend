import React, { useEffect, useState } from 'react';

import { BriefcaseIcon } from '@navikt/aksel-icons';

import { NyttVilkårDagligReise } from './EndreVilkår/NyttVilkårDagligReise';
import { Regelstruktur } from './typer/regelstrukturDagligReise';
import { VilkårDagligReise } from './typer/vilkårDagligReise';
import { VisEllerEndreVilkårDagligReise } from './VisEllerEndreVilkårDagligReise';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import {
    useVilkårDagligReise,
    VilkårDagligReiseProvider,
} from '../../../../context/VilkårDagligReiseContext/VilkårDagligReiseContext';
import DataViewer from '../../../../komponenter/DataViewer';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';

export const StønadsvilkårDagligReise = () => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [regelStruktur, settRegelstruktur] = useState<Ressurs<Regelstruktur>>(byggTomRessurs());

    const [eksisterendeVilkår, settEksisterendeVilkår] =
        React.useState<Ressurs<VilkårDagligReise[]>>(byggTomRessurs());

    useEffect(() => {
        request<Regelstruktur, null>('/api/sak/vilkar/daglig-reise/regler', 'GET').then(
            settRegelstruktur
        );
        request<VilkårDagligReise[], null>(
            `/api/sak/vilkar/daglig-reise/${behandling.id}`,
            'GET'
        ).then(settEksisterendeVilkår);
    }, [request, behandling.id]);

    return (
        <DataViewer type="vilkår" response={{ eksisterendeVilkår, regelStruktur }}>
            {({ eksisterendeVilkår, regelStruktur }) => (
                <VilkårDagligReiseProvider
                    eksisterendeVilkår={eksisterendeVilkår}
                    regelstruktur={regelStruktur}
                >
                    <StønadsvilkårInnhold />
                </VilkårDagligReiseProvider>
            )}
        </DataViewer>
    );
};

const StønadsvilkårInnhold = () => {
    const { vilkårsett } = useVilkårDagligReise();

    return (
        <VilkårPanel tittel={'Daglig Reise'} ikon={<BriefcaseIcon />}>
            {vilkårsett.map((vilkår, index) => (
                <VisEllerEndreVilkårDagligReise
                    key={vilkår.id}
                    vilkår={vilkår}
                    vilkårIndex={index + 1}
                />
            ))}

            <NyttVilkårDagligReise />
        </VilkårPanel>
    );
};
