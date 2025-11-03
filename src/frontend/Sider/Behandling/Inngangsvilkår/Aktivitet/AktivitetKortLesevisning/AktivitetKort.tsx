import React from 'react';

import { styled } from 'styled-components';

import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Label, VStack } from '@navikt/ds-react';

import { AktivitetkortFooter } from './AktivitetKortFooter';
import { useSteg } from '../../../../../context/StegContext';
import { ResultatOgStatusKort } from '../../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { Celle } from '../../../../../komponenter/Visningskomponenter/Celle';
import { Registeraktivitet } from '../../../../../typer/registeraktivitet';
import { formaterIsoPeriode } from '../../../../../utils/dato';
import { Aktivitet } from '../../typer/vilkårperiode/aktivitet';
import {
    VilkårPeriodeResultat,
    vilkårperiodeTypeTilTekst,
} from '../../typer/vilkårperiode/vilkårperiode';
import { FaktaOgDelvilkårVisning } from '../Delvilkår/FaktaOgDelvilkårVisning';

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

    const visRedigerKnapp =
        aktivitet.resultat != VilkårPeriodeResultat.SLETTET && erStegRedigerbart;

    return (
        <ResultatOgStatusKort
            periode={aktivitet}
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
            footer={
                <AktivitetkortFooter
                    aktivitet={aktivitet}
                    aktivitetFraRegister={aktivitetFraRegister}
                />
            }
        >
            <CelleContainer>
                <Celle $width={180}>
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
                <Celle $width={200}>
                    <FaktaOgDelvilkårVisning aktivitet={aktivitet} />
                </Celle>
                <Celle $width={400}>
                    <VStack>
                        <Label size="small">Begrunnelse:</Label>
                        <BodyShort size="small">{aktivitet.begrunnelse || '-'}</BodyShort>
                    </VStack>
                </Celle>
            </CelleContainer>
        </ResultatOgStatusKort>
    );
};
