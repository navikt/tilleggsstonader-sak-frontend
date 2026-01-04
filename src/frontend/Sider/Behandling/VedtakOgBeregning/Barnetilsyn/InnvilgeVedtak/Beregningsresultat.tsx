import React, { FC } from 'react';

import { BodyShort, Label, VStack } from '@navikt/ds-react';

import styles from './Beregningsresultat.module.css';
import { BeregningsresultatTilsynBarn } from '../../../../../typer/vedtak/vedtakTilsynBarn';
import { formaterTallMedTusenSkille } from '../../../../../utils/fomatering';
import { BeregningsresultatContainer } from '../../Felles/BeregningsresultatContainer';
import { ReadMoreTidligsteEndring } from '../../Felles/TidligsteEndringReadmore';

interface Props {
    beregningsresultat: BeregningsresultatTilsynBarn;
}

const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => (
    <VStack gap="4">
        <Label size="small">Beregningsresultat</Label>
        <BeregningsresultatContainer>
            <div className={styles.grid}>
                <Label>Periode</Label>
                <Label>Barn</Label>
                <Label>Månedlige utgifter</Label>
                <Label>Dagsats</Label>
                <Label>Stønadsbeløp</Label>
                {beregningsresultat.perioder.map((periode, indeks) => (
                    <React.Fragment key={indeks}>
                        <BodyShort size="small">{periode.grunnlag.måned}</BodyShort>
                        <BodyShort size="small">{periode.grunnlag.antallBarn}</BodyShort>
                        <BodyShort size="small">
                            {formaterTallMedTusenSkille(periode.grunnlag.utgifterTotal)}
                        </BodyShort>
                        <BodyShort size="small">{periode.dagsats}</BodyShort>
                        <BodyShort size="small">
                            {formaterTallMedTusenSkille(periode.månedsbeløp)}
                        </BodyShort>
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
