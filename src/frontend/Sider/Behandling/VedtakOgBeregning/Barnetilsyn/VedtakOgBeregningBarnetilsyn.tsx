import React, { FC, useState } from 'react';

import styled from 'styled-components';

import { InnvilgeVedtak } from './InnvilgeVedtak/InnvilgeVedtak';
import EkspanderbartPanel from '../../../../komponenter/EkspanderbartPanel';
import { BehandlingResultat } from '../../../../typer/behandling/behandlingResultat';
import { Vilkårsresultat } from '../../vilkår';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';

const Container = styled.div`
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const VedtakOgBeregningBarnetilsyn: FC = () => {
    const [resultatType, settResultatType] = useState<BehandlingResultat | undefined>();

    const utledVedtakForm = () => {
        switch (resultatType) {
            case BehandlingResultat.INNVILGET:
                return <InnvilgeVedtak settResultatType={settResultatType} />;

            case undefined:
                break;

            default:
                return <p>Ikke implementert</p>;
        }
    };

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
            {utledVedtakForm()}
        </Container>
    );
};

export default VedtakOgBeregningBarnetilsyn;
