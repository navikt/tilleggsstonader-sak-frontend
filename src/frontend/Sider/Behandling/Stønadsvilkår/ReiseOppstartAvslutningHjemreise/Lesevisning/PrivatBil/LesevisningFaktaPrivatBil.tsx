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

            {fakta?.aktivitetId && (
                <>
                    <BodyShort size="small">{'Aktivitet'}</BodyShort>
                    <BodyShort size="small">{fakta.aktivitetId}</BodyShort>
                </>
            )}
        </div>
    );
};
