import React from 'react';

import Aktivitet from './Aktivitet/Aktivitet';
import styles from './Inngangsvilkår.module.css';
import Målgruppe from './Målgruppe/Målgruppe';
import { OppdaterGrunnlagKnapp } from './OppdaterGrunnlag/OppdaterGrunnlagKnapp';
import { useBehandling } from '../../../context/BehandlingContext';
import { InngangsvilkårProvider } from '../../../context/InngangsvilkårContext';
import { useVilkårperioder } from '../../../hooks/useVilkårperioder';
import DataViewer from '../../../komponenter/DataViewer';
import { StegKnapp } from '../../../komponenter/Stegflyt/StegKnapp';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { Steg } from '../../../typer/behandling/steg';
import { FanePath } from '../faner';

const nesteFane = (stønadstype: Stønadstype): FanePath => {
    switch (stønadstype) {
        case Stønadstype.LÆREMIDLER:
            return FanePath.VEDTAK_OG_BEREGNING;
        case Stønadstype.BARNETILSYN:
        case Stønadstype.BOUTGIFTER:
            return FanePath.STØNADSVILKÅR;
        case Stønadstype.DAGLIG_REISE_TSR:
            return FanePath.STØNADSVILKÅR;
        case Stønadstype.DAGLIG_REISE_TSO:
            return FanePath.STØNADSVILKÅR;
    }
};

const Inngangsvilkår = () => {
    const { behandling } = useBehandling();

    const { vilkårperioderResponse, hentVilkårperioder } = useVilkårperioder(behandling.id);

    return (
        <div className={styles.container}>
            <DataViewer
                type={'inngangsvilkår'}
                response={{
                    vilkårperioderResponse,
                }}
            >
                {({ vilkårperioderResponse }) => (
                    <>
                        <InngangsvilkårProvider
                            vilkårperioder={vilkårperioderResponse.vilkårperioder}
                        >
                            <OppdaterGrunnlagKnapp
                                vilkårperioder={vilkårperioderResponse}
                                hentVilkårperioder={hentVilkårperioder}
                            />

                            <Aktivitet grunnlag={vilkårperioderResponse.grunnlag} />
                            <Målgruppe grunnlag={vilkårperioderResponse.grunnlag} />
                        </InngangsvilkårProvider>
                        <StegKnapp
                            steg={Steg.INNGANGSVILKÅR}
                            nesteFane={nesteFane(behandling.stønadstype)}
                        >
                            Ferdigstill inngangsvilkår og gå videre
                        </StegKnapp>
                    </>
                )}
            </DataViewer>
        </div>
    );
};

export default Inngangsvilkår;
