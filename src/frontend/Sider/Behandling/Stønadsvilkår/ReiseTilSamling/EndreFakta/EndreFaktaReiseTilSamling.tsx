import React from 'react';

import { EndreFaktaOffentligTransport } from './EndreFaktaOffentligTransport';
import { EndreFaktaPrivatBil } from './EndreFaktaPrivatBil';
import {
    Aktivitet,
    erAktivitetReiseTilSamlingTsr,
} from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
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
    const tiltaksvarianter = oppfylteAktiviteter
        .filter(erAktivitetReiseTilSamlingTsr)
        .map((aktivitet) => aktivitet.tiltaksvariant)
        .filter((tiltaksvariant) => tiltaksvariant != null);

    const tilgjengeligeTiltaksvarianter = Array.from(new Set(tiltaksvarianter)).sort((a, b) =>
        a.kode.localeCompare(b.kode)
    );

    switch (gjeldendeFaktaType) {
        case 'REISE_TIL_SAMLING_OFFENTLIG_TRANSPORT':
            return (
                <EndreFaktaOffentligTransport
                    fakta={fakta as FaktaOffentligTransport}
                    nullstillFeilOgUlagretkomponent={nullstillFeilOgUlagretkomponent}
                    settFakta={settFakta}
                    feilmeldinger={feilmeldinger.fakta as FeilmeldingerFaktaOffentligTransport}
                    gjelderTsr={gjelderTsr}
                    tilgjengeligeTiltaksvarianter={tilgjengeligeTiltaksvarianter}
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
    }

    return null;
};
