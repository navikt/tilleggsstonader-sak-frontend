import React, { FC } from 'react';

import { Alert, BodyShort, Label, VStack } from '@navikt/ds-react';

import styles from './Beregningsresultat.module.css';
import { BeregningsresultatBoutgifter } from '../../../../../typer/vedtak/vedtakBoutgifter';
import { formaterIsoDato } from '../../../../../utils/dato';
import { BeregningsresultatContainer } from '../../Felles/BeregningsresultatContainer';
import { ReadMoreTidligsteEndring } from '../../Felles/TidligsteEndringReadmore';

interface Props {
    beregningsresultat: BeregningsresultatBoutgifter;
}

const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => (
    <VStack gap="space-16">
        <Label size="small">Beregningsresultat</Label>
        <BeregningsresultatContainer>
            <div className={styles.grid}>
                <Label size="small">Fra og med</Label>
                <Label size="small">Til og med</Label>
                <Label size="small">Merutgift</Label>
                <Label size="small">Stønadsbeløp</Label>
                <div />
                {beregningsresultat.perioder.map((periode, indeks) => (
                    <React.Fragment key={indeks}>
                        <BodyShort size="small">{formaterIsoDato(periode.fom)}</BodyShort>
                        <BodyShort size="small">{formaterIsoDato(periode.tom)}</BodyShort>
                        <BodyShort size="small">{periode.sumUtgifter}</BodyShort>
                        <BodyShort size="small">{periode.stønadsbeløp}</BodyShort>
                        <div>
                            {periode.delAvTidligereUtbetaling && (
                                <Alert variant="info" size={'small'} inline>
                                    Treffer allerede utbetalt periode
                                </Alert>
                            )}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </BeregningsresultatContainer>
        {beregningsresultat.tidligsteEndring && (
            <ReadMoreTidligsteEndring tidligsteEndring={beregningsresultat.tidligsteEndring} />
        )}
    </VStack>
);

export default Beregningsresultat;
