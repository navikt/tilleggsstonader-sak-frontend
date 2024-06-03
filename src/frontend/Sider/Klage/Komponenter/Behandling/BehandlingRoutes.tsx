import { Navigate, Route, Routes } from 'react-router-dom';
import * as React from 'react';
import { Formkrav } from './Formkrav/Formkrav';
import { Brev } from './Brev/Brev';
import { Resultat } from './Resultat/Resultat';
import { Behandling, StegType } from '../../App/typer/fagsak';
import { Vurdering } from './Vurdering/Vurdering';

interface Props {
    behandling: Behandling;
}

const BehandlingRoutes: React.FC<Props> = ({ behandling }) => {
    const utledRedirectPath = (): string => {
        switch (behandling.steg) {
            case StegType.FORMKRAV:
                return 'formkrav';
            case StegType.VURDERING:
                return 'vurdering';
            case StegType.BREV:
                return 'brev';
            default:
                return 'resultat';
        }
    };

    const redirectUrl = `/klagebehandling/${behandling.id}/${utledRedirectPath()}`;

    return (
        <Routes>
            <Route path="/" element={<Navigate to={redirectUrl} replace={true} />} />
            <Route path="/formkrav" element={<Formkrav behandling={behandling} />} />
            <Route path="/vurdering" element={<Vurdering behandlingId={behandling.id} />} />
            <Route path="/brev" element={<Brev behandlingId={behandling.id} />} />
            <Route path="/resultat" element={<Resultat />} />
        </Routes>
    );
};

export default BehandlingRoutes;
