import React, { useEffect } from 'react';

import { VStack } from '@navikt/ds-react';

import { OppsummeringGruppe } from './OppsummeringGruppe';
import { VilkårOppsummeringRad } from './VilkårOppsummeringRad';
import { useBehandling } from '../../../context/BehandlingContext';
import { useHentVilkårsvurdering } from '../../../hooks/useHentVilkårsvurdering';
import DataViewer from '../../../komponenter/DataViewer';
import { BehandlingFaktaTilsynBarn } from '../../../typer/behandling/behandlingFakta/behandlingFakta';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';

export const OppsummeringVilkår: React.FC = () => {
    const { behandling, behandlingFakta } = useBehandling();
    const { hentVilkårsvurdering, vilkårsvurdering } = useHentVilkårsvurdering();

    useEffect(() => {
        hentVilkårsvurdering(behandling.id);
    }, [behandling.id, hentVilkårsvurdering]);

    const finnBarnNavn = (
        barnId: string | undefined,
        behandlingFakta: BehandlingFaktaTilsynBarn
    ) => {
        return behandlingFakta.barn.find((barn) => barn.barnId === barnId)?.registergrunnlag.navn;
    };

    return (
        <DataViewer response={{ vilkårsvurdering }}>
            {({ vilkårsvurdering }) => (
                <VStack gap={'6'}>
                    {behandlingFakta['@type'] === Stønadstype.BARNETILSYN && (
                        <OppsummeringGruppe tittel={'Pass av barn'}>
                            {vilkårsvurdering.vilkårsett.map((vilkår) => (
                                <VilkårOppsummeringRad
                                    key={vilkår.id}
                                    resultat={vilkår.resultat}
                                    fom={vilkår.fom}
                                    tom={vilkår.tom}
                                    gjelder={finnBarnNavn(vilkår.barnId, behandlingFakta)}
                                />
                            ))}
                        </OppsummeringGruppe>
                    )}
                </VStack>
            )}
        </DataViewer>
    );
};
