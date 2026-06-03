import React, { FC } from 'react';

import { BodyShort } from '@navikt/ds-react';

import styles from './LesevisningFaktaPrivatBil.module.css';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../../../../utils/fomatering';
import { FaktaPrivatBil } from '../../typer/faktaReiseTilSamling';

export const LesevisningFaktaPrivatBil: FC<{
    fakta: FaktaPrivatBil;
}> = ({ fakta }) => {
    return (
        <div className={styles.grid}>
            <BodyShort size="small">{'Reiseavstand in km'}</BodyShort>
            <BodyShort size="small">
                {fakta?.reiseavstand
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta.reiseavstand)} km`
                    : '-'}
            </BodyShort>
        </div>
    );
};
