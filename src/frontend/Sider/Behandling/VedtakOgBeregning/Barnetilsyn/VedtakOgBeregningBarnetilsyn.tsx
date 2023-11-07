import React, { FC, useEffect, useState } from 'react';

import styled from 'styled-components';

import { InnvilgeVedtak } from './InnvilgeVedtak/InnvilgeVedtak';
import { useVedtak } from '../../../../hooks/useVedtak';
import DataViewer from '../../../../komponenter/DataViewer';
import EkspanderbartPanel from '../../../../komponenter/EkspanderbartPanel';
import { BehandlingResultat } from '../../../../typer/behandling/behandlingResultat';
import { RessursStatus } from '../../../../typer/ressurs';
import { Vilkårsresultat } from '../../vilkår';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';

const Container = styled.div`
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const VedtakOgBeregningBarnetilsyn: FC = () => {
    const { vedtak } = useVedtak();

    const [resultatType, settResultatType] = useState<BehandlingResultat | undefined>();

    useEffect(() => {
        // TODO: Oppdater sjekk av resultat når flere implementeres
        // Sjekker at stønadsperioder eksisterer så resultat kun settes til innvilget om det finnes data
        if (vedtak.status === RessursStatus.SUKSESS && vedtak.data.stønadsperioder) {
            settResultatType(BehandlingResultat.INNVILGET);
        }
    }, [vedtak]);

    return (
        <Container>
            {/* TODO: Send inn korrekt resultat */}
            <EkspanderbartPanel
                tittel="Vedtak"
                resultat={
                    resultatType ? Vilkårsresultat.OPPFYLT : Vilkårsresultat.IKKE_TATT_STILLING_TIL
                }
            >
                <SelectVedtaksresultat
                    resultatType={resultatType}
                    settResultatType={settResultatType}
                />
            </EkspanderbartPanel>
            <DataViewer response={{ vedtak }}>
                {({ vedtak }) => {
                    switch (resultatType) {
                        case BehandlingResultat.INNVILGET:
                            return (
                                <InnvilgeVedtak
                                    settResultatType={settResultatType}
                                    lagretVedtak={vedtak}
                                />
                            );

                        case undefined:
                            return null;

                        default:
                            return <p>Ikke implementert</p>;
                    }
                }}
            </DataViewer>
        </Container>
    );
};

export default VedtakOgBeregningBarnetilsyn;
