import React from 'react';

import { styled } from 'styled-components';

import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Label, VStack } from '@navikt/ds-react';

import FaktaOgDelvilkårVisning from './Delvilkår/FaktaOgDelvilkårVisning';
import { useSteg } from '../../../../context/StegContext';
import { useRevurderingAvPerioder } from '../../../../hooks/useRevurderingAvPerioder';
import { Celle } from '../../../../komponenter/Visningskomponenter/Celle';
import { formaterIsoPeriode } from '../../../../utils/dato';
import { Målgruppe } from '../typer/målgruppe';
import { VilkårPeriodeResultat, vilkårperiodeTypeTilTekst } from '../typer/vilkårperiode';
import VilkårperiodeKortBase from '../Vilkårperioder/VilkårperiodeKort/VilkårperiodeKortBase';

const CelleContainer = styled.div`
    flex-grow: 1;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
`;

export const MålgruppeKort: React.FC<{
    målgruppe: Målgruppe;
    startRedigering: () => void;
}> = ({ målgruppe, startRedigering }) => {
    const { erStegRedigerbart } = useSteg();

    const { helePeriodenErLåstForEndring } = useRevurderingAvPerioder({
        periodeFom: målgruppe.fom,
        periodeTom: målgruppe.tom,
        nyRadLeggesTil: false,
    });

    const visRedigerKnapp =
        målgruppe.resultat != VilkårPeriodeResultat.SLETTET &&
        erStegRedigerbart &&
        !helePeriodenErLåstForEndring;

    return (
        <VilkårperiodeKortBase
            vilkårperiode={målgruppe}
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
                        {vilkårperiodeTypeTilTekst[målgruppe.type]}
                    </Label>
                </Celle>
                <Celle>
                    <BodyShort size="small">
                        {formaterIsoPeriode(målgruppe.fom, målgruppe.tom)}
                    </BodyShort>
                </Celle>
                <Celle>
                    <FaktaOgDelvilkårVisning vurderinger={målgruppe.faktaOgVurderinger} />
                </Celle>
                <Celle $width={300}>
                    <VStack>
                        <Label size="small">Begrunnelse:</Label>
                        <BodyShort size="small">{målgruppe.begrunnelse || '-'}</BodyShort>
                    </VStack>
                </Celle>
            </CelleContainer>
        </VilkårperiodeKortBase>
    );
};
