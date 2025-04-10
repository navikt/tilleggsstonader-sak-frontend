import * as React from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import { Brev } from '../Steg/Brev/Brev';
import { Formkrav } from '../Steg/Formkrav/Formkrav';
import { Resultat } from '../Steg/Resultat/Resultat';
import { Vurdering } from '../Steg/Vurdering/Vurdering';
import { Klagebehandling } from '../typer/klagebehandling/klagebehandling';
import { KlagebehandlingSteg } from '../typer/klagebehandling/klagebehandlingSteg';

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
            <Route path="/brev" element={<Brev />} />
            <Route path="/resultat" element={<Resultat />} />
        </Routes>
    );
};

export default BehandlingRoutes;
