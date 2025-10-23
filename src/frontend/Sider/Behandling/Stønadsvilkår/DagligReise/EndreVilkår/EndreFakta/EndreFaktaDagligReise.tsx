import React from 'react';

import { EndreFaktaOffentligTransport } from './EndreFaktaOffentligTransport';
import { FaktaDagligReise, FaktaOffentligTransport } from '../../typer/faktaDagligReise';
import { TypeVilkårFakta } from '../../typer/regelstrukturDagligReise';
import { FeilmeldingerDagligReise } from '../validering';

export const EndreFaktaDagligReise: React.FC<{
    gjeldendeFaktaType: TypeVilkårFakta | undefined;
    fakta: FaktaDagligReise | undefined;
    oppdaterFakta: (key: keyof FaktaOffentligTransport, verdi: number | undefined) => void;
    feilmeldinger: FeilmeldingerDagligReise;
}> = ({ gjeldendeFaktaType, fakta, oppdaterFakta, feilmeldinger }) => {
    switch (gjeldendeFaktaType) {
        case 'DAGLIG_REISE_OFFENTLIG_TRANSPORT':
            return (
                <EndreFaktaOffentligTransport
                    fakta={fakta as FaktaOffentligTransport}
                    oppdaterFakta={oppdaterFakta}
                    feilmeldinger={feilmeldinger}
                />
            );
        case 'DAGLIG_REISE_PRIVAT_BIL':
            return <p>Privat bil</p>;
    }

    return null;
};
