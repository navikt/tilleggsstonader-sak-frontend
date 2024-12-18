import React from 'react';

import { styled } from 'styled-components';

import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Label, VStack } from '@navikt/ds-react';

import { FaktaOgDelvilkårVisning } from './Delvilkår/FaktaOgDelvilkårVisning';
import { useSteg } from '../../../../context/StegContext';
import { useRevurderingAvPerioder } from '../../../../hooks/useRevurderingAvPerioder';
import { Celle } from '../../../../komponenter/Visningskomponenter/Celle';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { formaterIsoPeriode } from '../../../../utils/dato';
import { Aktivitet } from '../typer/vilkårperiode/aktivitet';
import {
    VilkårPeriodeResultat,
    vilkårperiodeTypeTilTekst,
} from '../typer/vilkårperiode/vilkårperiode';
import VilkårperiodeKortBase from '../Vilkårperioder/VilkårperiodeKort/VilkårperiodeKortBase';

const CelleContainer = styled.div`
    flex-grow: 1;
    display: flex;
    gap: 1.25rem;
    flex-wrap: wrap;
`;

export const AktivitetKort: React.FC<{
    aktivitet: Aktivitet;
    aktivitetFraRegister: Registeraktivitet | undefined;
    startRedigering: () => void;
}> = ({ aktivitet, aktivitetFraRegister, startRedigering }) => {
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
                    <BodyShort size="small">
                        <b>{formaterIsoPeriode(aktivitet.fom, aktivitet.tom)}</b>
                    </BodyShort>

                    <BodyShort size="small">{vilkårperiodeTypeTilTekst[aktivitet.type]}</BodyShort>
                    {aktivitetFraRegister?.typeNavn && (
                        <BodyShort size="small">{aktivitetFraRegister?.typeNavn}</BodyShort>
                    )}
                    {aktivitetFraRegister?.arrangør && (
                        <BodyShort size="small">{aktivitetFraRegister?.arrangør}</BodyShort>
                    )}
                </Celle>
                <Celle>
                    <FaktaOgDelvilkårVisning aktivitet={aktivitet} />
                </Celle>
                <Celle $width={400}>
                    <VStack>
                        <Label size="small">Begrunnelse:</Label>
                        <BodyShort size="small">{aktivitet.begrunnelse || '-'}</BodyShort>
                    </VStack>
                </Celle>
            </CelleContainer>
        </VilkårperiodeKortBase>
    );
};
