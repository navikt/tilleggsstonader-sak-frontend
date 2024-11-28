import React from 'react';

import { styled } from 'styled-components';

import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Label, VStack } from '@navikt/ds-react';

import { FaktaOgDelvilkårVisning } from './Delvilkår/FaktaOgDelvilkårVisning';
import { useSteg } from '../../../../context/StegContext';
import { useRevurderingAvPerioder } from '../../../../hooks/useRevurderingAvPerioder';
import { Celle } from '../../../../komponenter/Visningskomponenter/Celle';
import { formaterIsoPeriode } from '../../../../utils/dato';
import { Aktivitet } from '../typer/aktivitet';
import {
    VilkårPeriodeResultat,
    vilkårperiodeTypeTilTekst,
} from '../typer/vilkårperiode/vilkårperiode';
import VilkårperiodeKortBase from '../Vilkårperioder/VilkårperiodeKort/VilkårperiodeKortBase';

const CelleContainer = styled.div`
    flex-grow: 1;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
`;

export const AktivitetKort: React.FC<{
    aktivitet: Aktivitet;
    startRedigering: () => void;
}> = ({ aktivitet, startRedigering }) => {
    const { erStegRedigerbart } = useSteg();

    const { helePeriodenErLåstForEndring } = useRevurderingAvPerioder({
        periodeFom: aktivitet.fom,
        periodeTom: aktivitet.tom,
        nyRadLeggesTil: false,
    });

    const visRedigerKnapp =
        aktivitet.resultat != VilkårPeriodeResultat.SLETTET &&
        erStegRedigerbart &&
        !helePeriodenErLåstForEndring;

    return (
        <VilkårperiodeKortBase
            vilkårperiode={aktivitet}
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
                        {vilkårperiodeTypeTilTekst[aktivitet.type]}
                    </Label>
                </Celle>
                <Celle>
                    <BodyShort size="small">
                        {formaterIsoPeriode(aktivitet.fom, aktivitet.tom)}
                    </BodyShort>
                </Celle>
                <Celle>
                    <FaktaOgDelvilkårVisning aktivitet={aktivitet} />
                </Celle>
                <Celle $width={300}>
                    <VStack>
                        <Label size="small">Begrunnelse:</Label>
                        <BodyShort size="small">{aktivitet.begrunnelse || '-'}</BodyShort>
                    </VStack>
                </Celle>
            </CelleContainer>
        </VilkårperiodeKortBase>
    );
};
