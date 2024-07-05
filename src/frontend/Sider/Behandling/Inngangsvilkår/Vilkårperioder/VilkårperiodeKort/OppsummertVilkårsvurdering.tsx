import React from 'react';

import { styled } from 'styled-components';

import { CircleBrokenIcon } from '@navikt/aksel-icons';
import { Detail, HStack, Label, VStack } from '@navikt/ds-react';
import { AGray200 } from '@navikt/ds-tokens/dist/tokens';

import { VilkårperiodeResultatTilTekst, formaterDelvilkårKeys } from './tekstmapping';
import { finnDelvilkårTilOppsummering } from './utils';
import { VilkårsresultatIkon } from '../../../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import { formaterEnumVerdi } from '../../../../../utils/tekstformatering';
import { erMålgruppe } from '../../Målgruppe/utils';
import { Aktivitet } from '../../typer/aktivitet';
import {
    FaktiskMålgruppe,
    Målgruppe,
    MålgruppeTypeTilFaktiskMålgruppe,
} from '../../typer/målgruppe';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-left: 3px solid ${AGray200};
    padding-left: 1rem;
`;

export const informasjonForFaktisktMålgruppe: Record<FaktiskMålgruppe, string> = {
    NEDSATT_ARBEIDSEVNE: 'Nedsatt arbeidsevne',
    ENSLIG_FORSØRGER: 'Enslig forsørger',
    GJENLEVENDE: 'Gjenlevende',
    SYKEPENGER_100_PROSENT: 'Ikke i målgruppe',
    INGEN_MÅLGRUPPE: 'Ikke i målgruppe',
};

const OppsummertVilkårsvurdering: React.FC<{
    vilkårperiode?: Målgruppe | Aktivitet;
    redigeres: boolean;
    className?: string;
}> = ({ vilkårperiode, redigeres, className }) => {
    if (!vilkårperiode || redigeres) {
        return <OppsummeringKommer className={className} />;
    }

    const delvilkårSomMåOppsummeres = finnDelvilkårTilOppsummering(
        vilkårperiode.delvilkår,
        vilkårperiode.resultat
    );

    return (
        <Container className={className}>
            <HStack align="center" gap="4">
                <VilkårsresultatIkon vilkårsresultat={vilkårperiode.resultat} />
                <Label size="small">{VilkårperiodeResultatTilTekst[vilkårperiode.resultat]}</Label>
            </HStack>
            <VStack gap="2">
                {erMålgruppe(vilkårperiode) && (
                    <Detail>
                        <strong>Målgruppe: </strong>
                        {
                            informasjonForFaktisktMålgruppe[
                                MålgruppeTypeTilFaktiskMålgruppe[vilkårperiode.type]
                            ]
                        }
                    </Detail>
                )}
                {delvilkårSomMåOppsummeres.length > 0 && (
                    <Detail>
                        {`${formaterEnumVerdi(vilkårperiode.resultat)}: ${formaterDelvilkårKeys(delvilkårSomMåOppsummeres)}`}
                    </Detail>
                )}
            </VStack>
        </Container>
    );
};

const OppsummeringKommer: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <Container className={className}>
            <HStack wrap={false} gap="4">
                <span>
                    <CircleBrokenIcon />
                </span>
                <Label size="small">Oppsummert vilkårsvurdering vises når du lagrer</Label>
            </HStack>
        </Container>
    );
};

export default OppsummertVilkårsvurdering;
