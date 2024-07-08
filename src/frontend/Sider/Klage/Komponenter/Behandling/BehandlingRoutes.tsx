import { Navigate, Route, Routes } from 'react-router-dom';
import * as React from 'react';
import { Formkrav } from '../../Steg/Formkrav/Formkrav';
import { Brev } from '../../Steg/Brev/Brev';
import { Resultat } from '../../Steg/Resultat/Resultat';
import { Klagebehandling } from '../../App/typer/klagebehandling/klagebehandling';
import { Vurdering } from '../../Steg/Vurdering/Vurdering';
import { KlagebehandlingSteg } from '../../App/typer/klagebehandling/klagebehandlingSteg';

interface Props {
    behandling: Klagebehandling;
}

const BehandlingRoutes: React.FC<Props> = ({ behandling }) => {
    const utledRedirectPath = (): string => {
        switch (behandling.steg) {
            case KlagebehandlingSteg.FORMKRAV:
                return 'formkrav';
            case KlagebehandlingSteg.VURDERING:
                return 'vurdering';
            case KlagebehandlingSteg.BREV:
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
