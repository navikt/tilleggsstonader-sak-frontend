import React, { FC } from 'react';

import { BodyShort } from '@navikt/ds-react';

import styles from './LesevisningFaktaPrivatBil.module.css';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../../../../utils/fomatering';
import { FaktaPrivatBil } from '../../typer/faktaReiseOppstartAvslutningHjemreise';

export const LesevisningFaktaPrivatBil: FC<{
    fakta: FaktaPrivatBil;
}> = ({ fakta }) => {
    return (
        <div className={styles.grid}>
            <BodyShort size="small">{'Reiseavstand i km'}</BodyShort>
            <BodyShort size="small">
                {fakta?.reiseavstand
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta.reiseavstand)} km`
                    : '-'}
            </BodyShort>
            <BodyShort size="small">{'Bompenger'}</BodyShort>
            <BodyShort size="small">
                {fakta?.bompenger ? formaterTallMedTusenSkilleEllerStrek(fakta.bompenger) : '-'}
            </BodyShort>
            <BodyShort size="small">{'Fergekostnad'}</BodyShort>
            <BodyShort size="small">
                {fakta?.fergekostnad
                    ? formaterTallMedTusenSkilleEllerStrek(fakta.fergekostnad)
                    : '-'}
            </BodyShort>
        </div>
    );
};
