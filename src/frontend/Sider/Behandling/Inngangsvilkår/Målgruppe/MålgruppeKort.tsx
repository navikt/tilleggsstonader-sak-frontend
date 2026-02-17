import React from 'react';

import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Label, VStack } from '@navikt/ds-react';

import FaktaOgDelvilkårVisning from './Delvilkår/FaktaOgDelvilkårVisning';
import styles from './MålgruppeKort.module.css';
import { useSteg } from '../../../../context/StegContext';
import { ResultatOgStatusKort } from '../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { Celle } from '../../../../komponenter/Visningskomponenter/Celle';
import { formaterIsoPeriode } from '../../../../utils/dato';
import { Målgruppe, målgruppeTilYtelsestypeTekst } from '../typer/vilkårperiode/målgruppe';
import { målgruppeTilFaktiskMålgruppeTekst } from '../typer/vilkårperiode/målgruppeTilFaktiskMålgruppe';
import { VilkårPeriodeResultat } from '../typer/vilkårperiode/vilkårperiode';
import { VilkårperiodeResultatTilTekst } from '../Vilkårperioder/VilkårperiodeKort/tekstmapping';

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
            <div className={styles.celleContainer}>
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
                <Celle $width={350}>
                    <VStack>
                        <Label size="small">Begrunnelse:</Label>
                        <BodyShort size="small">{målgruppe.begrunnelse || '-'}</BodyShort>
                    </VStack>
                    {målgruppe.slettetKommentar && (
                        <VStack gap="space-8">
                            <Label size="small">Begrunnelse for sletting:</Label>
                            <BodyShort size="small">{målgruppe.slettetKommentar || '-'}</BodyShort>
                        </VStack>
                    )}
                </Celle>
            </div>
        </ResultatOgStatusKort>
    );
};
