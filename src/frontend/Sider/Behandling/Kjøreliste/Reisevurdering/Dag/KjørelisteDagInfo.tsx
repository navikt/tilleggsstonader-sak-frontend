import React, { FC } from 'react';

import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';
import { BgWarningStrong } from '@navikt/ds-tokens/js';

import { AvklartKjørtDagStatus, Dag } from '../../../../../typer/kjøreliste';
import { ukedagTilKortNorsk, formaterIsoDato } from '../../../../../utils/dato';
import { formatBoolean, kronerEllerStrek } from '../../../../../utils/tekstformatering';
import { harAvvikPåHellidagEllerHelg, harAvvikPåParkeringsutgift } from '../../utils';
import styles from '../UkeInnhold.module.css';

export const KjørelisteDagInfo: FC<{
    dag: Dag;
    erUkeSlettet: boolean;
}> = ({ dag, erUkeSlettet }) => {
    const dagHarForHøyParkeringsutgift = harAvvikPåParkeringsutgift(dag);
    const dagHarAvvikPåHellidagEllerHelg = harAvvikPåHellidagEllerHelg(dag);
    const skalHaSlettetStyling =
        !erUkeSlettet &&
        dag.erDagSlettet &&
        dag.avklartDag?.avklartKjørtDagStatus !== AvklartKjørtDagStatus.SLETTET;

    return (
        <div className={`${styles.venstreGrid} ${styles.bakgrunnOgBorder}`}>
            <BodyShort size="small" className={skalHaSlettetStyling ? styles.slettet : undefined}>
                {ukedagTilKortNorsk[dag.ukedag]}
            </BodyShort>
            <BodyShort size="small" className={skalHaSlettetStyling ? styles.slettet : undefined}>
                {formaterIsoDato(dag.dato)}
            </BodyShort>
            <HStack gap="space-4">
                <BodyShort size="small">{formatBoolean(dag.kjørelisteDag?.harKjørt)}</BodyShort>
                {dagHarAvvikPåHellidagEllerHelg && (
                    <ExclamationmarkTriangleFillIcon color={BgWarningStrong} />
                )}
            </HStack>
            <HStack gap="space-4">
                <BodyShort size="small">
                    {kronerEllerStrek(dag.kjørelisteDag?.parkeringsutgift)}
                </BodyShort>
                {dagHarForHøyParkeringsutgift && (
                    <ExclamationmarkTriangleFillIcon color={BgWarningStrong} />
                )}
            </HStack>
        </div>
    );
};
