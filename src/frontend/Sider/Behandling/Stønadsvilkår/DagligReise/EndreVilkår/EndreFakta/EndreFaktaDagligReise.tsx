import React from 'react';

import { EndreFaktaOffentligTransport } from './EndreFaktaOffentligTransport';
import { FaktaDagligReise, FaktaOffentligTransport } from '../../typer/faktaDagligReise';
import { TypeVilkårFakta } from '../../typer/regelstrukturDagligReise';
import { FeilmeldingerDagligReise } from '../validering';

export const EndreFaktaDagligReise: React.FC<{
    gjeldendeFaktaType: TypeVilkårFakta | undefined;
    fakta: FaktaDagligReise | undefined;
    settFakta: React.Dispatch<React.SetStateAction<FaktaDagligReise | undefined>>;
    feilmeldinger: FeilmeldingerDagligReise;
}> = ({ gjeldendeFaktaType, fakta, settFakta, feilmeldinger }) => {
    switch (gjeldendeFaktaType) {
        case 'DAGLIG_REISE_OFFENTLIG_TRANSPORT':
            return (
                <EndreFaktaOffentligTransport
                    fakta={fakta as FaktaOffentligTransport}
                    settFakta={settFakta}
                    feilmeldinger={feilmeldinger}
                />
            );
        case 'DAGLIG_REISE_PRIVAT_BIL':
            return <p>Privat bil</p>;
    }

    return null;
};
