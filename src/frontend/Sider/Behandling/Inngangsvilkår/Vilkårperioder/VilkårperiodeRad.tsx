import React from 'react';

import { styled } from 'styled-components';

import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Label, VStack } from '@navikt/ds-react';

import DelvilkårDetaljer from './VilkårperiodeKort/DelvilkårDetaljer';
import VilkårperiodeKortBase from './VilkårperiodeKort/VilkårperiodeKortBase';
import { useSteg } from '../../../../context/StegContext';
import { useRevurderingAvPerioder } from '../../../../hooks/useRevurderingAvPerioder';
import { Celle } from '../../../../komponenter/Visningskomponenter/Celle';
import { formaterIsoPeriode } from '../../../../utils/dato';
import { Aktivitet } from '../typer/aktivitet';
import { Målgruppe } from '../typer/målgruppe';
import { VilkårPeriodeResultat, vilkårperiodeTypeTilTekst } from '../typer/vilkårperiode';

const CelleContainer = styled.div`
    flex-grow: 1;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
`;

// TODO: Endre navn til VilkårperiodeKort
const VilkårperiodeRad: React.FC<{
    vilkårperiode: Målgruppe | Aktivitet;
    startRedigering: () => void;
}> = ({ vilkårperiode, startRedigering }) => {
    const { erStegRedigerbart } = useSteg();

    const { helePeriodenErLåstForEndring } = useRevurderingAvPerioder({
        periodeFom: vilkårperiode.fom,
        periodeTom: vilkårperiode.tom,
        nyRadLeggesTil: false,
    });

    const visRedigerKnapp =
        vilkårperiode.resultat != VilkårPeriodeResultat.SLETTET &&
        erStegRedigerbart &&
        !helePeriodenErLåstForEndring;

    return (
        <VilkårperiodeKortBase
            vilkårperiode={vilkårperiode}
            redigeringKnapp={
                visRedigerKnapp && (
                    <Button
                        variant="tertiary"
                        size="small"
                        onClick={startRedigering}
                        icon={<PencilIcon />}
                    />
                )
            }
        >
            <CelleContainer>
                <Celle>
                    <Label size="small" className="ytelse">
                        {vilkårperiodeTypeTilTekst[vilkårperiode.type]}
                    </Label>
                </Celle>
                <Celle>
                    <BodyShort size="small">
                        {formaterIsoPeriode(vilkårperiode.fom, vilkårperiode.tom)}
                    </BodyShort>
                </Celle>
                <Celle>
                    <DelvilkårDetaljer
                        delvilkår={vilkårperiode.delvilkår}
                        aktivitetsdager={(vilkårperiode as Aktivitet).aktivitetsdager}
                    />
                </Celle>
                <Celle $width={300}>
                    <VStack>
                        <Label size="small">Begrunnelse:</Label>
                        <BodyShort size="small">{vilkårperiode.begrunnelse || '-'}</BodyShort>
                    </VStack>
                </Celle>
            </CelleContainer>
        </VilkårperiodeKortBase>
    );
};

export default VilkårperiodeRad;
