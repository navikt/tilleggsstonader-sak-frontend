import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import HistorikkElement from './HistorikkElement';
import { HistorikkHendelse } from './typer';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import DataViewer from '../../../../komponenter/DataViewer';
import { Ressurs, byggTomRessurs } from '../../../../typer/ressurs';

const Container = styled.ul`
    margin: 0;
    padding: 0;
`;

const Historikk: React.FC = () => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [historikk, settHistorikk] = useState<Ressurs<HistorikkHendelse[]>>(byggTomRessurs());

    useEffect(() => {
        request<HistorikkHendelse[], null>(`/api/sak/behandlingshistorikk/${behandling.id}`).then(
            settHistorikk
        );
    }, [request, behandling.id]);

    return (
        <DataViewer response={{ historikk }}>
            {({ historikk }) => (
                <Container>
                    {historikk.map((historikkElement, index) => {
                        const erSisteElementIListe = index === historikk.length - 1;

                        return (
                            <HistorikkElement
                                erSisteElementIListe={erSisteElementIListe}
                                historikkHendelse={historikkElement}
                                key={index}
                            />
                        );
                    })}
                </Container>
            )}
        </DataViewer>
    );
};

export default Historikk;
