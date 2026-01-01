import React from 'react';

import { BodyShort, Label } from '@navikt/ds-react';

import styles from './UtgifterTabell.module.css';
import { UtgiftBoutgift } from '../../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterNullableIsoDato } from '../../../../utils/dato';

export const UtgifterTabell: React.FC<{
    utgifter: UtgiftBoutgift[];
}> = ({ utgifter }) => {
    return (
        <div className={styles.grid}>
            <Label size={'small'}>Fom</Label>
            <Label size={'small'}>Tom</Label>
            <Label size={'small'}>Utgift</Label>
            <Label size={'small'}>Beløp som dekkes</Label>

            {utgifter.map((utgift) => (
                <React.Fragment key={`${utgift.fom}-${utgift.tom}`}>
                    <BodyShort size={'small'}>{formaterNullableIsoDato(utgift.fom)}</BodyShort>
                    <BodyShort size={'small'}>{formaterNullableIsoDato(utgift.tom)}</BodyShort>
                    <BodyShort size={'small'}>{utgift.utgift} kr</BodyShort>
                    <BodyShort size={'small'}>{utgift.beløpSomDekkes} kr</BodyShort>
                </React.Fragment>
            ))}
        </div>
    );
};
