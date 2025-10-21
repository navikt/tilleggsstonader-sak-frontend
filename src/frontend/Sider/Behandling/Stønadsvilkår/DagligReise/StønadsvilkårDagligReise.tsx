import React from 'react';

import { BriefcaseIcon } from '@navikt/aksel-icons';

import { NyttVilkårDagligReise } from './EndreVilkår/NyttVilkårDagligReise';
import { VisEllerEndreVilkårDagligReise } from './VisEllerEndreVilkårDagligReise';
import {
    useVilkårDagligReise,
    VilkårDagligReiseProvider,
} from '../../../../context/VilkårDagligReiseContext/VilkårDagligReiseContext';
import { useHentVilkårDagligReise } from '../../../../hooks/useHentVilkårsvurdering';
import { useRegelstruktur } from '../../../../hooks/useRegler';
import DataViewer from '../../../../komponenter/DataViewer';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';

export const StønadsvilkårDagligReise = () => {
    const { regelStruktur } = useRegelstruktur();
    const { eksisterendeVilkår } = useHentVilkårDagligReise();

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
