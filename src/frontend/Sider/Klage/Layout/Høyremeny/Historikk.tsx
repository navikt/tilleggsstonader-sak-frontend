import * as React from 'react';
import HistorikkInnslag from './HistorikkInnslag';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import DataViewer from '../../../../komponenter/DataViewer';
import { Behandlingshistorikk } from '../../typer/behandlingshistorikk';
import { Klagebehandling } from '../../typer/klagebehandling/klagebehandling';

const Historikk: React.FC<{ hidden: boolean }> = ({ hidden }) => {
    const { behandling, behandlingHistorikk } = useKlagebehandling();

    if (hidden) {
        return <></>;
    }

    return (
        <DataViewer response={{ behandling, behandlingHistorikk }}>
            {({ behandling, behandlingHistorikk }) => (
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
                    <HistorikkInnslag
                        behandling={behandling}
                        historikksteg={historikk.steg}
                        opprettetAv={historikk.opprettetAv}
                        endretTid={historikk.endretTid}
                        key={index}
                    />
                );
            })}
        </>
    );
};

export default Historikk;
