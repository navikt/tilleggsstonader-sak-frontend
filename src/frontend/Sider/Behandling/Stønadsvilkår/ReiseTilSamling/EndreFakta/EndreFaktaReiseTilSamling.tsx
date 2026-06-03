import React from 'react';

import { EndreFaktaOffentligTransport } from './EndreFaktaOffentligTransport';
import { EndreFaktaPrivatBil } from './EndreFaktaPrivatBil';
import {
    FeilmeldingerFaktaOffentligTransport,
    FeilmeldingerFaktaPrivatBil,
    FeilmeldingerReiseTilSamling,
} from '../EndreVilkår/validering';
import {
    FaktaOffentligTransport,
    FaktaPrivatBil,
    FaktaReiseTilSamling,
} from '../typer/faktaReiseTilSamling';
import { TypeVilkårFakta } from '../typer/regelstrukturReiseTilSamling';

export const EndreFaktaReiseTilSamling: React.FC<{
    gjeldendeFaktaType: TypeVilkårFakta;
    fakta: FaktaReiseTilSamling;
    settFakta: React.Dispatch<React.SetStateAction<FaktaReiseTilSamling>>;
    nullstillFeilOgUlagretkomponent: () => void;
    feilmeldinger: FeilmeldingerReiseTilSamling;
}> = ({ gjeldendeFaktaType, fakta, nullstillFeilOgUlagretkomponent, settFakta, feilmeldinger }) => {
    switch (gjeldendeFaktaType) {
        case 'REISE_TIL_SAMLING_OFFENTLIG_TRANSPORT':
            return (
                <EndreFaktaOffentligTransport
                    fakta={fakta as FaktaOffentligTransport}
                    nullstillFeilOgUlagretkomponent={nullstillFeilOgUlagretkomponent}
                    settFakta={settFakta}
                    feilmeldinger={feilmeldinger.fakta as FeilmeldingerFaktaOffentligTransport}
                />
            );
        case 'REISE_TIL_SAMLING_PRIVAT_BIL':
            return (
                <EndreFaktaPrivatBil
                    fakta={fakta as FaktaPrivatBil}
                    nullstillFeilOgUlagretkomponent={nullstillFeilOgUlagretkomponent}
                    settFakta={settFakta as () => FaktaPrivatBil}
                    feilmeldinger={feilmeldinger.fakta as FeilmeldingerFaktaPrivatBil}
                />
            );
    }

    return null;
};
