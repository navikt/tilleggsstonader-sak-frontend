import * as React from 'react';

import HistorikkInnslag from './HistorikkInnslag';
import DataViewer from '../../../../komponenter/DataViewer';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import { Behandlingshistorikk } from '../../typer/behandlingshistorikk';
import { Klagebehandling } from '../../typer/klagebehandling/klagebehandling';

const Historikk: React.FC<{ hidden: boolean }> = ({ hidden }) => {
    const { behandling, behandlingHistorikk } = useKlagebehandling();

    if (hidden) {
        return <></>;
    }

    return (
        <DataViewer type={'behandlingshistorikk'} response={{ behandlingHistorikk }}>
            {({ behandlingHistorikk }) => (
                <HistorikkContainer
                    behandling={behandling}
                    behandlingHistorikk={behandlingHistorikk}
                />
            )}
        </DataViewer>
    );
};

const HistorikkContainer: React.FC<{
    behandling: Klagebehandling;
    behandlingHistorikk: Behandlingshistorikk[];
}> = ({ behandling, behandlingHistorikk }) => {
    return (
        <>
            {behandlingHistorikk.map((historikk, index) => {
                return (
                    <HistorikkInnslag key={index} behandling={behandling} historikk={historikk} />
                );
            })}
        </>
    );
};

export default Historikk;
