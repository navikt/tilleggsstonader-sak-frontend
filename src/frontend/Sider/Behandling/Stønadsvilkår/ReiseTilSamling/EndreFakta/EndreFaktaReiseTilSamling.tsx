import React from 'react';

import { EndreFaktaDrosje } from './EndreFaktaDrosje';
import { EndreFaktaOffentligTransport } from './EndreFaktaOffentligTransport';
import { EndreFaktaPrivatBil } from './EndreFaktaPrivatBil';
import { Aktivitet } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import {
    FeilmeldingerFaktaOffentligTransport,
    FeilmeldingerFaktaPrivatBil,
    FeilmeldingerFaktaDrosje,
    FeilmeldingerReiseTilSamling,
} from '../EndreVilkår/validering';
import {
    FaktaOffentligTransport,
    FaktaPrivatBil,
    FaktaDrosje,
    FaktaReiseTilSamling,
} from '../typer/faktaReiseTilSamling';
import { TypeVilkårFakta } from '../typer/regelstrukturReiseTilSamling';

export const EndreFaktaReiseTilSamling: React.FC<{
    gjeldendeFaktaType: TypeVilkårFakta;
    fakta: FaktaReiseTilSamling;
    settFakta: React.Dispatch<React.SetStateAction<FaktaReiseTilSamling>>;
    nullstillFeilOgUlagretkomponent: () => void;
    feilmeldinger: FeilmeldingerReiseTilSamling;
    oppfylteAktiviteter: Aktivitet[];
    gjelderTsr: boolean;
}> = ({
    gjeldendeFaktaType,
    fakta,
    nullstillFeilOgUlagretkomponent,
    settFakta,
    feilmeldinger,
    oppfylteAktiviteter,
    gjelderTsr,
}) => {
    switch (gjeldendeFaktaType) {
        case 'REISE_TIL_SAMLING_OFFENTLIG_TRANSPORT':
            return (
                <EndreFaktaOffentligTransport
                    fakta={fakta as FaktaOffentligTransport}
                    nullstillFeilOgUlagretkomponent={nullstillFeilOgUlagretkomponent}
                    settFakta={settFakta}
                    feilmeldinger={feilmeldinger.fakta as FeilmeldingerFaktaOffentligTransport}
                    gjelderTsr={gjelderTsr}
                    oppfylteAktiviteter={oppfylteAktiviteter}
                />
            );
        case 'REISE_TIL_SAMLING_PRIVAT_BIL':
            return (
                <EndreFaktaPrivatBil
                    fakta={fakta as FaktaPrivatBil}
                    nullstillFeilOgUlagretkomponent={nullstillFeilOgUlagretkomponent}
                    settFakta={settFakta as () => FaktaPrivatBil}
                    feilmeldinger={feilmeldinger.fakta as FeilmeldingerFaktaPrivatBil}
                    oppfylteAktiviteter={oppfylteAktiviteter}
                    gjelderTsr={gjelderTsr}
                />
            );
        case 'REISE_TIL_SAMLING_DROSJE':
            return (
                <EndreFaktaDrosje
                    fakta={fakta as FaktaDrosje}
                    nullstillFeilOgUlagretkomponent={nullstillFeilOgUlagretkomponent}
                    settFakta={settFakta}
                    feilmeldinger={feilmeldinger.fakta as FeilmeldingerFaktaDrosje}
                    oppfylteAktiviteter={oppfylteAktiviteter}
                    gjelderTsr={gjelderTsr}
                />
            );
    }

    return null;
};
