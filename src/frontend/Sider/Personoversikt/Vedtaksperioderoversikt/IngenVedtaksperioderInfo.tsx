import React from 'react';

import { BodyShort, HStack } from '@navikt/ds-react';

import styles from './IngenVedtaksperioderInfo.module.css';
import Info from '../../../komponenter/Ikoner/Vurderingsresultat/Info';
import { formaterDatoMedTidspunkt } from '../../../utils/dato';

export const IngenVedtaksperioderInfo = ({
    hentetTidspunkt,
}: {
    hentetTidspunkt: Date | undefined;
}) => {
    return (
        <HStack gap={'2'} align={'center'}>
            <Info className={styles.styledInfo} />
            <BodyShort>
                Ingen vedtaksperioder funnet. Oppdatert: {formaterDatoMedTidspunkt(hentetTidspunkt)}
            </BodyShort>
        </HStack>
    );
};
