import * as React from 'react';
import HistorikkInnslag from './HistorikkInnslag';
import { useBehandling } from '../../../App/context/BehandlingContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { IBehandlingshistorikk } from './behandlingshistorikk';
import { Behandling } from '../../../App/typer/fagsak';

const Historikk: React.FC<{ hidden: boolean }> = ({ hidden }) => {
    // const { behandling, behandlingHistorikk } = useBehandling();

    if (hidden) {
        return <></>;
    }

    return (<></>
        // <DataViewer response={{ behandling, behandlingHistorikk }}>
        //     {({ behandling, behandlingHistorikk }) => (
        //         <HistorikkContainer
        //             behandling={behandling}
        //             behandlingHistorikk={behandlingHistorikk}
        //         />
        //     )}
        // </DataViewer>
    );
};

const HistorikkContainer: React.FC<{
    behandling: Behandling;
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
