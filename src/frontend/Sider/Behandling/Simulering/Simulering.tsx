import React from 'react';

import styled from 'styled-components';

import { Button } from '@navikt/ds-react';

import SimuleringResultatWrapper from './SimuleringResultatWrapper';
import { useBehandling } from '../../../context/BehandlingContext';
import { useNavigateUtenSjekkForUlagredeKomponenter } from '../../../hooks/useNavigateUtenSjekkForUlagredeKomponenter';
import { useVedtak } from '../../../hooks/useVedtak';
import DataViewer from '../../../komponenter/DataViewer';
import { BehandlingResultat } from '../../../typer/behandling/behandlingResultat';
import { BehandlingStatus } from '../../../typer/behandling/behandlingStatus';
import { FanePath } from '../faner';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: fit-content;
    align-items: flex-start;
`;

const Simulering: React.FC = () => {
    const navigate = useNavigateUtenSjekkForUlagredeKomponenter();
    const { vedtak } = useVedtak();
    const { behandling } = useBehandling();

    const gåTilNesteSteg = () => {
        navigate(`/behandling/${behandling.id}/${FanePath.BREV}`);
    };

    return (
        <Container>
            <DataViewer type={'vedtak'} response={{ vedtak }}>
                {({ vedtak }) => <SimuleringResultatWrapper vedtak={vedtak} />}
            </DataViewer>
            {behandling.resultat === BehandlingResultat.IKKE_SATT &&
                behandling.status !== BehandlingStatus.FATTER_VEDTAK && (
                    <Button
                        variant="primary"
                        size="small"
                        onClick={() => {
                            gåTilNesteSteg();
                        }}
                    >
                        Neste
                    </Button>
                )}
        </Container>
    );
};
export default Simulering;
