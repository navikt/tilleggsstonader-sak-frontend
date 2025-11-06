import React from 'react';

import { styled } from 'styled-components';

import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Label, VStack } from '@navikt/ds-react';

import FaktaOgDelvilkårVisning from './Delvilkår/FaktaOgDelvilkårVisning';
import { useSteg } from '../../../../context/StegContext';
import { ResultatOgStatusKort } from '../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { Celle } from '../../../../komponenter/Visningskomponenter/Celle';
import { formaterIsoPeriode } from '../../../../utils/dato';
import { Målgruppe, målgruppeTilYtelsestypeTekst } from '../typer/vilkårperiode/målgruppe';
import { målgruppeTilFaktiskMålgruppeTekst } from '../typer/vilkårperiode/målgruppeTilFaktiskMålgruppe';
import { VilkårPeriodeResultat } from '../typer/vilkårperiode/vilkårperiode';
import { VilkårperiodeResultatTilTekst } from '../Vilkårperioder/VilkårperiodeKort/tekstmapping';

const CelleContainer = styled.div`
    flex-grow: 1;
    display: flex;
    gap: 1.25rem;
    flex-wrap: wrap;
`;

export const MålgruppeKort: React.FC<{
    målgruppe: Målgruppe;
    startRedigering: () => void;
}> = ({ målgruppe, startRedigering }) => {
    const { erStegRedigerbart } = useSteg();

    const visRedigerKnapp =
        målgruppe.resultat != VilkårPeriodeResultat.SLETTET && erStegRedigerbart;

    const ytelse = målgruppeTilYtelsestypeTekst(målgruppe.type);

    return (
        <ResultatOgStatusKort
            periode={målgruppe}
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
                <Celle $width={180}>
                    <Label size="small">{formaterIsoPeriode(målgruppe.fom, målgruppe.tom)}</Label>
                    <BodyShort size="small">
                        {VilkårperiodeResultatTilTekst[målgruppe.resultat]}
                    </BodyShort>
                </Celle>
                <Celle $width={180}>
                    {ytelse && <BodyShort size="small">{ytelse}</BodyShort>}
                    <BodyShort size="small">
                        {målgruppeTilFaktiskMålgruppeTekst(målgruppe.type)}
                    </BodyShort>
                </Celle>
                <Celle $width={200}>
                    <FaktaOgDelvilkårVisning vurderinger={målgruppe.faktaOgVurderinger} />
                </Celle>
                <Celle>
                    <VStack>
                        <Label size="small">Begrunnelse:</Label>
                        <BodyShort size="small">{målgruppe.begrunnelse || '-'}</BodyShort>
                    </VStack>
                    {målgruppe.slettetKommentar && (
                        <VStack gap="2">
                            <Label size="small">Begrunnelse for sletting:</Label>
                            <BodyShort size="small">{målgruppe.slettetKommentar || '-'}</BodyShort>
                        </VStack>
                    )}
                </Celle>
            </CelleContainer>
        </ResultatOgStatusKort>
    );
};
