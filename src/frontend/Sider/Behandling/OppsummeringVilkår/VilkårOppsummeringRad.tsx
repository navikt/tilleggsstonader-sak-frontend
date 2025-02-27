import React from 'react';

import { BodyShort, HStack } from '@navikt/ds-react';

import { VilkårsresultatIkon } from '../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import { formaterNullablePeriode } from '../../../utils/dato';
import { aktivitetTypeTilTekst } from '../Inngangsvilkår/Aktivitet/utilsAktivitet';
import { Målgruppe, målgruppeTypeTilTekst } from '../Inngangsvilkår/typer/vilkårperiode/målgruppe';
import {
    VilkårPeriodeAktivitet,
    VilkårPeriodeResultat,
} from '../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { Vilkårsresultat } from '../vilkår';

interface VilkårOppsummeringRadProps {
    resultat: VilkårPeriodeResultat | Vilkårsresultat;
    fom?: string;
    tom?: string;
    gjelder?: string;
}

export const VilkårOppsummeringRad: React.FC<VilkårOppsummeringRadProps> = ({
    resultat,
    fom,
    tom,
    gjelder,
}) => {
    return (
        <HStack gap={'2'} align={'center'}>
            <VilkårsresultatIkon vilkårsresultat={resultat} height={18} width={18} />
            <BodyShort
                size={'small'}
            >{`${formaterNullablePeriode(fom, tom)}: ${gjelder}`}</BodyShort>
        </HStack>
    );
};

export const OppsummeringAktiviteter = ({
    aktiviteter,
}: {
    aktiviteter: VilkårPeriodeAktivitet[];
}) => {
    return aktiviteter.map((aktivitet) => (
        <VilkårOppsummeringRad
            key={aktivitet.id}
            resultat={aktivitet.resultat}
            fom={aktivitet.fom}
            tom={aktivitet.tom}
            gjelder={aktivitetTypeTilTekst(aktivitet.type)}
        />
    ));
};

export const OppsummeringMålgrupper = ({ målgrupper }: { målgrupper: Målgruppe[] }) => {
    return målgrupper.map((målgruppe) => (
        <VilkårOppsummeringRad
            key={målgruppe.id}
            resultat={målgruppe.resultat}
            fom={målgruppe.fom}
            tom={målgruppe.tom}
            gjelder={målgruppeTypeTilTekst(målgruppe.type)}
        />
    ));
};
