import React from 'react';

import { BodyShort, Label, VStack } from '@navikt/ds-react';

import { VilkårOppsummeringRad } from './OppsummeringRad';
import { OppsummertVilkårperiode } from '../../../../typer/behandling/behandlingOppsummering';
import { aktivitetTypeTilTekst } from '../../Inngangsvilkår/Aktivitet/utilsAktivitet';
import { AktivitetType } from '../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import {
    MålgruppeType,
    målgruppeTypeTilTekst,
} from '../../Inngangsvilkår/typer/vilkårperiode/målgruppe';

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
                        aktivitetsdager={aktivitet.aktivitetsdager}
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
