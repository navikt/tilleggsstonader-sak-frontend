import React, { FC } from 'react';

import { BodyShort, Detail, Label, VStack } from '@navikt/ds-react';

import styles from './LesevisningFaktaPrivatBil.module.css';
import { formaterIsoPeriode } from '../../../../../../utils/dato';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../../../../utils/fomatering';
import { FaktaPrivatBil } from '../../typer/faktaDagligReise';

export const LesevisningFaktaPrivatBil: FC<{
    fakta: FaktaPrivatBil;
}> = ({ fakta }) => {
    return (
        <VStack gap="space-64" paddingBlock="space-16 space-0">
            <VStack gap="space-16">
                <div className={styles.grid}>
                    <Label size="small">Periode</Label>
                    <Label size="small" className={styles.høyreJustert}>
                        Reisedager
                    </Label>
                    <Label size="small" className={styles.høyreJustert}>
                        Bom
                    </Label>
                    <Label size="small" className={styles.høyreJustert}>
                        Ferge
                    </Label>
                    {fakta.faktaDelperioder.map((periode, index) => (
                        <React.Fragment key={index}>
                            <BodyShort size="small">
                                {formaterIsoPeriode(periode.fom, periode.tom)}
                            </BodyShort>
                            <BodyShort size="small" className={styles.høyreJustert}>
                                {periode?.reisedagerPerUke ? `${periode.reisedagerPerUke}` : '-'}
                            </BodyShort>
                            <BodyShort size="small" className={styles.høyreJustert}>
                                {periode?.bompengerPerDag
                                    ? `${formaterTallMedTusenSkilleEllerStrek(periode?.bompengerPerDag)} kr`
                                    : '-'}
                            </BodyShort>
                            <BodyShort size="small" className={styles.høyreJustert}>
                                {periode?.fergekostnadPerDag
                                    ? `${formaterTallMedTusenSkilleEllerStrek(periode.fergekostnadPerDag)} kr`
                                    : '-'}
                            </BodyShort>
                        </React.Fragment>
                    ))}
                </div>
                <Detail>* Alle priser er oppgitt per dag</Detail>
            </VStack>
        </VStack>
    );
};
