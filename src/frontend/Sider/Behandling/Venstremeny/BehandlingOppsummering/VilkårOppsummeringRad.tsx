import React from 'react';

import { BodyShort, HStack, Label, VStack } from '@navikt/ds-react';

import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import { OppsummertVilkårperiode } from '../../../../typer/behandling/behandlingOppsummering';
import { formaterNullablePeriode } from '../../../../utils/dato';
import { aktivitetTypeTilTekst } from '../../Inngangsvilkår/Aktivitet/utilsAktivitet';
import { AktivitetType } from '../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import {
    MålgruppeType,
    målgruppeTypeTilTekst,
} from '../../Inngangsvilkår/typer/vilkårperiode/målgruppe';
import { VilkårPeriodeResultat } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { Vilkårsresultat } from '../../vilkår';

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
        <HStack gap={'2'} align={'center'} className={'info'} wrap={false}>
            <VilkårsresultatIkon vilkårsresultat={resultat} height={18} width={18} />
            <BodyShort
                size={'small'}
            >{`${formaterNullablePeriode(fom, tom)}: ${gjelder}`}</BodyShort>
        </HStack>
    );
};

export const OppsummeringAktiviteter: React.FC<{
    aktiviteter: OppsummertVilkårperiode<AktivitetType>[];
}> = ({ aktiviteter }) => {
    return (
        <VStack gap="2">
            <Label size="small">Aktiviteter</Label>
            {aktiviteter.length > 0 ? (
                aktiviteter.map((aktivitet) => (
                    <VilkårOppsummeringRad
                        key={aktivitet.id}
                        resultat={aktivitet.resultat}
                        fom={aktivitet.fom}
                        tom={aktivitet.tom}
                        gjelder={aktivitetTypeTilTekst(aktivitet.type)}
                    />
                ))
            ) : (
                <BodyShort size={'small'}>Ingen aktiviteter</BodyShort>
            )}
        </VStack>
    );
};

export const OppsummeringMålgrupper: React.FC<{
    målgrupper: OppsummertVilkårperiode<MålgruppeType>[];
}> = ({ målgrupper }) => {
    return (
        <VStack gap="2">
            <Label size="small">Målgrupper</Label>
            {målgrupper.length > 0 ? (
                målgrupper.map((målgruppe) => (
                    <VilkårOppsummeringRad
                        key={målgruppe.id}
                        resultat={målgruppe.resultat}
                        fom={målgruppe.fom}
                        tom={målgruppe.tom}
                        gjelder={målgruppeTypeTilTekst(målgruppe.type)}
                    />
                ))
            ) : (
                <BodyShort size={'small'}>Ingen målgrupper</BodyShort>
            )}
        </VStack>
    );
};
