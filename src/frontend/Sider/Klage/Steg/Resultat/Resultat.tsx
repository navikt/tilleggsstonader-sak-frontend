import * as React from 'react';

import styled from 'styled-components';

import { Heading } from '@navikt/ds-react';

import { AnkeVisning } from './AnkeVisning';
import { FeilregistrertVisning } from './FeilregistrertVisning';
import { Tidslinje } from './Tidslinje';
import DataViewer from '../../../../komponenter/DataViewer';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';

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
    const { behandling, behandlingHistorikk, åpenHøyremeny } = useKlagebehandling();

    return (
        <DataViewer type={'behandlingshistorikk'} response={{ behandlingHistorikk }}>
            {({ behandlingHistorikk }) => (
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
                            behandlingHistorikk={behandlingHistorikk}
                            åpenHøyremeny={åpenHøyremeny}
                        />
                    </TidslinjeContainer>
                </>
            )}
        </DataViewer>
    );
};
