import React, { FC } from 'react';

import { BodyShort, HStack } from '@navikt/ds-react';

import { AvklartDag } from '../../../../../typer/kjøreliste';
import { kronerEllerStrek } from '../../../../../utils/tekstformatering';
import { godkjentGjennomførtKjøringTilTekst } from '../../utils';
import styles from '../UkeInnhold.module.css';

export const AvklartDagLesevisning: FC<{
    avklartDag: AvklartDag | undefined;
}> = ({ avklartDag }) => {
    return (
        <div className={styles.høyreGrid}>
            <HStack gap="space-4">
                <BodyShort size="small">
                    {avklartDag &&
                        godkjentGjennomførtKjøringTilTekst[avklartDag.godkjentGjennomførtKjøring]}
                </BodyShort>
            </HStack>
            <BodyShort size="small">{kronerEllerStrek(avklartDag?.parkeringsutgift)}</BodyShort>
            <BodyShort size="small">{avklartDag?.begrunnelse || '-'}</BodyShort>
        </div>
    );
};
