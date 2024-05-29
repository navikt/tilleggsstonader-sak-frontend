import * as React from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { Tidslinje } from './Tidslinje';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Heading } from '@navikt/ds-react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { AnkeVisning } from './AnkeVisning';
import { FeilregistrertVisning } from './FeilregistrertVisning';

const HeadingContainer = styled.div`
    margin: 2rem 5rem 0rem 5rem;
`;

const TidslinjeContainer = styled.div<{ åpenHøyremeny: boolean }>`
    @media (max-width: ${(props) => (props.åpenHøyremeny ? '1449px' : '1149px')}) {
        display: flex;
        justify-content: center;
    }
    @media (min-width: ${(props) => (props.åpenHøyremeny ? '1450px' : '1150px')}) {
        margin-top: 12rem;
    }
`;

export const Resultat: React.FC = () => {
    const {
        behandling,
        hentBehandling,
        // behandlingHistorikk,
        åpenHøyremeny,
    } = useBehandling();

    useEffect(() => {
        hentBehandling.rerun();
    }, [hentBehandling]);

    return (
        <DataViewer
            response={{
                behandling,
                // behandlingHistorikk
            }}
        >
            {({
                behandling,
                // behandlingHistorikk
            }) => (
                <>
                    <HeadingContainer>
                        <Heading spacing size="large" level="5">
                            Resultat
                        </Heading>
                        <FeilregistrertVisning behandling={behandling} />
                        <AnkeVisning behandling={behandling} />
                    </HeadingContainer>
                    <TidslinjeContainer åpenHøyremeny={åpenHøyremeny}>
                        <Tidslinje
                            behandling={behandling}
                            // behandlingHistorikk={behandlingHistorikk}
                            åpenHøyremeny={åpenHøyremeny}
                        />
                    </TidslinjeContainer>
                </>
            )}
        </DataViewer>
    );
};
