import React, { FC } from 'react';

import { Alert, BodyShort, Label, VStack } from '@navikt/ds-react';

import styles from './Beregningsresultat.module.css';
import { BeregningsresultatLæremidler } from '../../../../../typer/vedtak/vedtakLæremidler';
import { formaterIsoDato } from '../../../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../../../utils/fomatering';
import { studienivåTilTekst } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitetLæremidler';
import { skalViseBeregningsresultat } from '../../Felles/beregningsplanUtils';
import { BeregningsresultatContainer } from '../../Felles/BeregningsresultatContainer';
import { GjenbrukForrigeResultatAlert } from '../../Felles/GjenbrukForrigeResultatAlert';
import { HvorforVisesIkkeFlereEndringerReadMore } from '../../Felles/HvorforVisesIkkeFlereEndringerReadMore';

export const Beregningsresultat: FC<{ beregningsresultat: BeregningsresultatLæremidler }> = ({
    beregningsresultat,
}) => {
    const visBeregningsresultat = skalViseBeregningsresultat(beregningsresultat.beregningsplan);

    return (
        <VStack gap="space-16">
            <Label size="small">Beregningsresultat</Label>
            {visBeregningsresultat ? (
                <BeregningsresultatContainer>
                    <div className={styles.grid}>
                        <Label>Fom</Label>
                        <Label>Tom</Label>
                        <Label>Ant. måneder</Label>
                        <Label>Studienivå</Label>
                        <Label>Prosent</Label>
                        <Label>Månedsbeløp</Label>
                        <Label>Stønadsbeløp</Label>
                        <div />
                        {beregningsresultat.perioder.map((periode, indeks) => (
                            <React.Fragment key={indeks}>
                                <BodyShort size="small">{formaterIsoDato(periode.fom)}</BodyShort>
                                <BodyShort size="small">{formaterIsoDato(periode.tom)}</BodyShort>
                                <BodyShort size="small">{periode.antallMåneder}</BodyShort>
                                <BodyShort size="small">
                                    {studienivåTilTekst[periode.studienivå]}
                                </BodyShort>
                                <BodyShort size="small">{periode.studieprosent}%</BodyShort>
                                <BodyShort size="small">
                                    {formaterTallMedTusenSkille(periode.stønadsbeløpPerMåned)} kr
                                </BodyShort>
                                <BodyShort size="small">
                                    {formaterTallMedTusenSkille(periode.stønadsbeløpForPeriode)} kr
                                </BodyShort>
                                <div>
                                    {periode.delAvTidligereUtbetaling && (
                                        <Alert variant="info" size={'small'} inline>
                                            Treffer allerede utbetalt mnd
                                        </Alert>
                                    )}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </BeregningsresultatContainer>
            ) : (
                <GjenbrukForrigeResultatAlert beregningsplan={beregningsresultat.beregningsplan} />
            )}
            <HvorforVisesIkkeFlereEndringerReadMore
                beregningsplan={beregningsresultat.beregningsplan}
            />
        </VStack>
    );
};
