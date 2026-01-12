import React from 'react';

import { EndreFaktaOffentligTransport } from './EndreFaktaOffentligTransport';
import { EndreFaktaPrivatBil } from './EndreFaktaPrivatBil';
import {
    FaktaDagligReise,
    FaktaOffentligTransport,
    FaktaPrivatBil,
} from '../../typer/faktaDagligReise';
import { TypeVilkårFakta } from '../../typer/regelstrukturDagligReise';
import { FeilmeldingerDagligReise } from '../validering';

export const EndreFaktaDagligReise: React.FC<{
    gjeldendeFaktaType: TypeVilkårFakta | undefined;
    fakta: FaktaDagligReise | undefined;
    settFakta: React.Dispatch<React.SetStateAction<FaktaDagligReise | undefined>>;
    nullstillFeilOgUlagretkomponent: () => void;

    feilmeldinger: FeilmeldingerDagligReise;
}> = ({ gjeldendeFaktaType, fakta, nullstillFeilOgUlagretkomponent, settFakta, feilmeldinger }) => {
    switch (gjeldendeFaktaType) {
        case 'DAGLIG_REISE_OFFENTLIG_TRANSPORT':
            return (
                <EndreFaktaOffentligTransport
                    fakta={fakta as FaktaOffentligTransport}
                    nullstillFeilOgUlagretkomponent={nullstillFeilOgUlagretkomponent}
                    settFakta={settFakta}
                    feilmeldinger={feilmeldinger.fakta}
                />
            );
        case 'DAGLIG_REISE_PRIVAT_BIL':
            return (
                <EndreFaktaPrivatBil
                    fakta={fakta as FaktaPrivatBil}
                    nullstillFeilOgUlagretkomponent={nullstillFeilOgUlagretkomponent}
                    settFakta={settFakta}
                />
            );
    }

    return null;
};
