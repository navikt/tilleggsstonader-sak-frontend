import React, { FC } from 'react';

import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';
import { BgWarningStrong } from '@navikt/ds-tokens/js';

import { Dag } from '../../../../../typer/kjøreliste';
import { ukedagTilKortNorsk, formaterIsoDato } from '../../../../../utils/dato';
import { formatBoolean, kronerEllerStrek } from '../../../../../utils/tekstformatering';
import { harAvvikPåParkeringsutgift } from '../../utils';
import styles from '../UkeInnhold.module.css';

export const KjørelisteDagInfo: FC<{
    dag: Dag;
}> = ({ dag }) => {
    const dagHarForHøyParkeringsutgift = harAvvikPåParkeringsutgift(dag);

    return (
        <div className={styles.venstreGrid}>
            <BodyShort size="small">{ukedagTilKortNorsk[dag.ukedag]}</BodyShort>
            <BodyShort size="small">{formaterIsoDato(dag.dato)}</BodyShort>
            <BodyShort size="small">{formatBoolean(dag.kjørelisteDag?.harKjørt)}</BodyShort>
            <HStack>
                {dagHarForHøyParkeringsutgift && (
                    <ExclamationmarkTriangleFillIcon color={BgWarningStrong} />
                )}
                <BodyShort size="small">
                    {kronerEllerStrek(dag.kjørelisteDag?.parkeringsutgift)}
                </BodyShort>
            </HStack>
        </div>
    );
};
