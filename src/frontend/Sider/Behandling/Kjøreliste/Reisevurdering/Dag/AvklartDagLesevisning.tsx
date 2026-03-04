import React, { FC } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { AvklartDag } from '../../../../../typer/kjøreliste';
import { formaterEnumVerdi, kronerEllerStrek } from '../../../../../utils/tekstformatering';
import styles from '../UkeInnhold.module.css';

export const AvklartDagLesevisning: FC<{
    avklartDag: AvklartDag | undefined;
}> = ({ avklartDag }) => {
    return (
        <div className={styles.høyreGrid}>
            <BodyShort size="small">
                {formaterEnumVerdi(avklartDag?.godkjentGjennomførtKjøring)}
            </BodyShort>
            <BodyShort size="small">{kronerEllerStrek(avklartDag?.parkeringsutgift)}</BodyShort>
            <BodyShort size="small">{avklartDag?.begrunnelse || '-'}</BodyShort>
        </div>
    );
};
