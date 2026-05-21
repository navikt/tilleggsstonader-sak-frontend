import React from 'react';

import { EndreFaktaOffentligTransport } from './EndreFaktaOffentligTransport';
import { EndreFaktaPrivatBil } from './EndreFaktaPrivatBil';
import { Aktivitet } from '../../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { AktivitetDagligReiseTsr } from '../../../../Inngangsvilkår/typer/vilkårperiode/aktivitetDagligReiseTsr';
import {
    FaktaDagligReise,
    FaktaOffentligTransport,
    FaktaPrivatBil,
} from '../../typer/faktaDagligReise';
import { TypeVilkårFakta } from '../../typer/regelstrukturDagligReise';
import {
    FeilmeldingerDagligReise,
    FeilmeldingerFaktaOffentligTransport,
    FeilmeldingerFaktaPrivatBil,
} from '../validering';

export const EndreFaktaDagligReise: React.FC<{
    gjeldendeFaktaType: TypeVilkårFakta;
    fakta: FaktaDagligReise;
    reiseFom: string;
    reiseTom: string;
    settFakta: React.Dispatch<React.SetStateAction<FaktaDagligReise>>;
    nullstillFeilOgUlagretkomponent: () => void;
    feilmeldinger: FeilmeldingerDagligReise;
    oppfylteAktiviteter: Aktivitet[];
    gjelderTsr: boolean;
}> = ({
    gjeldendeFaktaType,
    fakta,
    nullstillFeilOgUlagretkomponent,
    settFakta,
    feilmeldinger,
    oppfylteAktiviteter,
    reiseFom,
    reiseTom,
    gjelderTsr,
}) => {
    const typeAktiviteter = oppfylteAktiviteter
        .filter(
            (aktivitet): aktivitet is AktivitetDagligReiseTsr =>
                aktivitet.faktaOgVurderinger['@type'] === 'AKTIVITET_DAGLIG_REISE_TSR'
        )
        .map((aktivitet) => aktivitet.typeAktivitet)
        .filter((typeAktivitet) => typeAktivitet != null);

    const tilgjengeligeTypeAktiviteter = Array.from(new Set(typeAktiviteter)).sort((a, b) =>
        a.kode.localeCompare(b.kode)
    );

    switch (gjeldendeFaktaType) {
        case 'DAGLIG_REISE_OFFENTLIG_TRANSPORT':
            return (
                <EndreFaktaOffentligTransport
                    fakta={fakta as FaktaOffentligTransport}
                    nullstillFeilOgUlagretkomponent={nullstillFeilOgUlagretkomponent}
                    settFakta={settFakta}
                    feilmeldinger={feilmeldinger.fakta as FeilmeldingerFaktaOffentligTransport}
                    gjelderTsr={gjelderTsr}
                    tilgjengeligeTypeAktiviteter={tilgjengeligeTypeAktiviteter}
                />
            );
        case 'DAGLIG_REISE_PRIVAT_BIL':
            return (
                <EndreFaktaPrivatBil
                    fakta={fakta as FaktaPrivatBil}
                    reiseFom={reiseFom}
                    reiseTom={reiseTom}
                    nullstillFeilOgUlagretkomponent={nullstillFeilOgUlagretkomponent}
                    settFakta={settFakta as () => FaktaPrivatBil}
                    feilmeldinger={feilmeldinger.fakta as FeilmeldingerFaktaPrivatBil}
                    oppfylteAktiviteter={oppfylteAktiviteter}
                />
            );
    }

    return null;
};
