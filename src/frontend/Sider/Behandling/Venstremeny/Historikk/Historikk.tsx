import React from 'react';

import styled from 'styled-components';

import HistorikkElement from './HistorikkElement';
import { useBehandling } from '../../../../context/BehandlingContext';
import DataViewer from '../../../../komponenter/DataViewer';

const Container = styled.ul`
    margin: 0;
    padding: 0;
`;

const Historikk: React.FC = () => {
    const { behandlingshistorikk } = useBehandling();

    return (
        <DataViewer response={{ behandlingshistorikk }}>
            {({ behandlingshistorikk }) => (
                <Container>
                    {behandlingshistorikk.map((historikkElement, index) => {
                        const erSisteElementIListe = index === behandlingshistorikk.length - 1;

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
