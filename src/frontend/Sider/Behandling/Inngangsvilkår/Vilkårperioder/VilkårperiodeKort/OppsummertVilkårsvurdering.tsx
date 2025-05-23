import React from 'react';

import { styled } from 'styled-components';

import { CircleBrokenIcon } from '@navikt/aksel-icons';
import { Detail, HStack, Label, VStack } from '@navikt/ds-react';
import { AGray200 } from '@navikt/ds-tokens/dist/tokens';

import { VilkårperiodeResultatTilTekst, formaterDelvilkårKeys } from './tekstmapping';
import { finnDelvilkårTilOppsummering } from './utils';
import { VilkårsresultatIkon } from '../../../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import { formaterEnumVerdi } from '../../../../../utils/tekstformatering';
import { FaktiskMålgruppeTilTekst } from '../../../Felles/faktiskMålgruppe';
import { erMålgruppe } from '../../Målgruppe/utils';
import { Aktivitet } from '../../typer/vilkårperiode/aktivitet';
import { Målgruppe } from '../../typer/vilkårperiode/målgruppe';
import {
    FaktiskMålgruppeEllerIngenMålgruppe,
    målgruppeTilFaktiskMålgruppeEllerIngenMålgruppe,
} from '../../typer/vilkårperiode/målgruppeTilFaktiskMålgruppe';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-left: 3px solid ${AGray200};
    padding-left: 1rem;
    height: 100%;
`;

const informasjonForFaktisktMålgruppe: Record<FaktiskMålgruppeEllerIngenMålgruppe, string> = {
    ...FaktiskMålgruppeTilTekst,
    SYKEPENGER_100_PROSENT: 'Ikke i målgruppe',
    INGEN_MÅLGRUPPE: 'Ikke i målgruppe',
};

export const OppsummertVilkårsvurdering: React.FC<{
    vilkårperiode?: Målgruppe | Aktivitet;
    redigeres: boolean;
    className?: string;
}> = ({ vilkårperiode, redigeres, className }) => {
    if (!vilkårperiode || redigeres) {
        return <OppsummeringKommer className={className} />;
    }

    return (
        <Container className={className}>
            <HStack align="center" gap="4">
                <VilkårsresultatIkon vilkårsresultat={vilkårperiode.resultat} />
                <Label size="small">{VilkårperiodeResultatTilTekst[vilkårperiode.resultat]}</Label>
            </HStack>
            {vilkårperiode.resultat === 'SLETTET' ? (
                <SlettetPeriodeOppsummering slettetKommentar={vilkårperiode.slettetKommentar} />
            ) : (
                <OppsummeringAvDelvilkår vilkårperiode={vilkårperiode} />
            )}
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

const SlettetPeriodeOppsummering: React.FC<{ slettetKommentar?: string }> = ({
    slettetKommentar,
}) => {
    return <Detail>{slettetKommentar}</Detail>;
};

const OppsummeringAvDelvilkår: React.FC<{ vilkårperiode: Målgruppe | Aktivitet }> = ({
    vilkårperiode,
}) => {
    const delvilkårSomMåOppsummeres = finnDelvilkårTilOppsummering(
        vilkårperiode.faktaOgVurderinger,
        vilkårperiode.resultat
    );

    return (
        <VStack gap="2">
            {erMålgruppe(vilkårperiode) && (
                <Detail>
                    <strong>Målgruppe: </strong>
                    {
                        informasjonForFaktisktMålgruppe[
                            målgruppeTilFaktiskMålgruppeEllerIngenMålgruppe[vilkårperiode.type]
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
    );
};
