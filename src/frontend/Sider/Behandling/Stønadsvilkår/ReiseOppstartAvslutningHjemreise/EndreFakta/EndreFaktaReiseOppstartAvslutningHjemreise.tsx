import React from 'react';

import { EndreFaktaOffentligTransport } from './EndreFaktaOffentligTransport';
import { EndreFaktaPrivatBil } from './EndreFaktaPrivatBil';
import { Aktivitet } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import {
    FeilmeldingerFaktaOffentligTransport,
    FeilmeldingerFaktaPrivatBil,
    FeilmeldingerReiseOppstartAvslutningHjemreise,
} from '../EndreVilkår/validering';
import {
    FaktaOffentligTransport,
    FaktaPrivatBil,
    FaktaReiseOppstartAvslutningHjemreise,
} from '../typer/faktaReiseOppstartAvslutningHjemreise';
import { TypeVilkårFakta } from '../typer/regelstrukturReiseOppstartAvslutningHjemreise';

export const EndreFaktaReiseOppstartAvslutningHjemreise: React.FC<{
    gjeldendeFaktaType: TypeVilkårFakta;
    fakta: FaktaReiseOppstartAvslutningHjemreise;
    settFakta: React.Dispatch<React.SetStateAction<FaktaReiseOppstartAvslutningHjemreise>>;
    nullstillFeilOgUlagretkomponent: () => void;
    feilmeldinger: FeilmeldingerReiseOppstartAvslutningHjemreise;
    aktivitet: Aktivitet;
}> = ({
    gjeldendeFaktaType,
    fakta,
    nullstillFeilOgUlagretkomponent,
    settFakta,
    feilmeldinger,
    aktivitet,
}) => {
    switch (gjeldendeFaktaType) {
        case 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_OFFENTLIG_TRANSPORT':
            return (
                <EndreFaktaOffentligTransport
                    fakta={fakta as FaktaOffentligTransport}
                    nullstillFeilOgUlagretkomponent={nullstillFeilOgUlagretkomponent}
                    settFakta={settFakta}
                    feilmeldinger={feilmeldinger.fakta as FeilmeldingerFaktaOffentligTransport}
                    aktivitet={aktivitet}
                />
            );
        case 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_PRIVAT_BIL':
            return (
                <EndreFaktaPrivatBil
                    fakta={fakta as FaktaPrivatBil}
                    nullstillFeilOgUlagretkomponent={nullstillFeilOgUlagretkomponent}
                    settFakta={settFakta as () => FaktaPrivatBil}
                    feilmeldinger={feilmeldinger.fakta as FeilmeldingerFaktaPrivatBil}
                    aktivitet={aktivitet}
                />
            );
    }

    return null;
};
