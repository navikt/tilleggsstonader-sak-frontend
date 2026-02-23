import React, { FC } from 'react';

import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';
import { BgWarningStrong } from '@navikt/ds-tokens/js';

import { Dag } from '../../../../typer/kjøreliste';
import { formaterIsoDato, ukedagTilKortNorsk } from '../../../../utils/dato';
import { formatBoolean } from '../../../../utils/tekstformatering';
import { harAvvikPåParkeringsutgift } from '../utils';

export const DagInfoLeservisning: FC<{ dag: Dag }> = ({ dag }) => {
    const parkeringsutgift = dag.kjørelisteDag?.parkeringsutgift || '-';
    const dagHarForHøyParkeringsutgift = harAvvikPåParkeringsutgift(dag);

    return (
        <React.Fragment>
            <BodyShort size="small">{ukedagTilKortNorsk[dag.ukedag]}</BodyShort>
            <BodyShort size="small">{formaterIsoDato(dag.dato)}</BodyShort>
            <BodyShort size="small">{formatBoolean(dag.kjørelisteDag?.harKjørt)}</BodyShort>
            <HStack>
                <BodyShort size="small">{parkeringsutgift} </BodyShort>
                {dagHarForHøyParkeringsutgift && (
                    <ExclamationmarkTriangleFillIcon color={BgWarningStrong} />
                )}
            </HStack>
            <BodyShort size="small">{dag.avklartDag?.automatiskVurdering}</BodyShort>
            <BodyShort size="small">{dag.avklartDag?.avvik}</BodyShort>
        </React.Fragment>
    );
};
