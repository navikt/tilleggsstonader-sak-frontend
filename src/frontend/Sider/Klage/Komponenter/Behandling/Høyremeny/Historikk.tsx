import * as React from 'react';
import HistorikkInnslag from './HistorikkInnslag';
import { useKlagebehandling } from '../../../App/context/KlagebehandlingContext';
import DataViewer from '../../../../../komponenter/DataViewer';
import { IBehandlingshistorikk } from './behandlingshistorikk';
import { Klagebehandling } from '../../../App/typer/klagebehandling/klagebehandling';

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
    behandlingHistorikk: IBehandlingshistorikk[];
}> = ({ behandling, behandlingHistorikk }) => {
    return (
        <>
            {behandlingHistorikk.map((historikk, index) => {
                return (
                    <HistorikkInnslag
                        behandling={behandling}
                        steg={historikk.steg}
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
