import React, { FC } from 'react';

import { BodyShort } from '@navikt/ds-react';

import styles from './LesevisningFaktaOffentligTransport.module.css';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../../../../utils/fomatering';
import { FaktaOffentligTransport } from '../../typer/faktaDagligReise';

export const LesevisningFaktaOffentligTransport: FC<{
    fakta: FaktaOffentligTransport;
}> = ({ fakta }) => {
    return (
        <div className={styles.grid}>
            <BodyShort size="small">{'Reisedager pr uke'}</BodyShort>
            <BodyShort size="small">
                {fakta?.reisedagerPerUke ? `${fakta.reisedagerPerUke}` : '-'}
            </BodyShort>

            <BodyShort size="small">{'Pris enkeltbillett'}</BodyShort>
            <BodyShort size="small">
                {fakta?.prisEnkelbillett
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta.prisEnkelbillett)} kr`
                    : '-'}
            </BodyShort>

            <BodyShort size="small">{'Pris 7-dagersbillett'}</BodyShort>
            <BodyShort size="small">
                {fakta?.prisSyvdagersbillett
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta?.prisSyvdagersbillett)} kr`
                    : '-'}
            </BodyShort>

            <BodyShort size="small">{'Pris 30-dagersbillett'}</BodyShort>
            <BodyShort size="small">
                {fakta?.prisTrettidagersbillett
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta.prisTrettidagersbillett)} kr`
                    : '-'}
            </BodyShort>
        </div>
    );
};
