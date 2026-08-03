import React from 'react';

import { BodyShort, HStack } from '@navikt/ds-react';

import { finnForkortetUkedagFraDato, formaterIsoDato } from '../../../../../utils/dato';
import { formatBoolean, kronerEllerStrek } from '../../../../../utils/tekstformatering';
import { KjørelisteDag } from '../typer';
import { UkeGrid } from '../UkeGrid';

export const UkeInnholdLagretKjøreliste: React.FC<{ dager: KjørelisteDag[] }> = ({ dager }) => {
    return (
        <UkeGrid gråBakgrunn>
            {dager.map((dag, dagIndeks) => (
                <React.Fragment key={dagIndeks}>
                    <BodyShort size="small">{finnForkortetUkedagFraDato(dag.dato)}</BodyShort>
                    <BodyShort size="small">{formaterIsoDato(dag.dato)}</BodyShort>
                    <HStack gap="space-4">
                        <BodyShort size="small">{formatBoolean(dag.harKjørt)}</BodyShort>
                    </HStack>
                    <HStack gap="space-4">
                        <BodyShort size="small">{kronerEllerStrek(dag.parkeringsutgift)}</BodyShort>
                    </HStack>
                </React.Fragment>
            ))}
        </UkeGrid>
    );
};
