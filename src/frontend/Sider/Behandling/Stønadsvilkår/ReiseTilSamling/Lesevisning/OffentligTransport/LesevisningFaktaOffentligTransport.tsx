import React, { FC } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { formaterTallMedTusenSkilleEllerStrek } from '../../../../../../utils/fomatering';
import { FaktaOffentligTransport } from '../../typer/faktaReiseTilSamling';
import styles from '../LesevisningFaktaReiseTilSamling.module.css';

export const LesevisningFaktaOffentligTransport: FC<{
    fakta: FaktaOffentligTransport | undefined;
}> = ({ fakta }) => {
    return (
        <div className={styles.grid}>
            <BodyShort size="small">{'Utgifter offentlig transport'}</BodyShort>
            <BodyShort size="small">
                {fakta?.utgifterOffentligTransport
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta.utgifterOffentligTransport)} kr`
                    : '-'}
            </BodyShort>
        </div>
    );
};
