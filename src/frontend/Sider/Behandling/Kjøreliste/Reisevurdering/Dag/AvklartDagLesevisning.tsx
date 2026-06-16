import React, { FC } from 'react';

import { BodyShort, HStack, Tag } from '@navikt/ds-react';

import { AvklartDag, AvklartKjørtDagStatus } from '../../../../../typer/kjøreliste';
import { kronerEllerStrek } from '../../../../../utils/tekstformatering';
import { godkjentGjennomførtKjøringTilTekst } from '../../utils';
import styles from '../UkeInnhold.module.css';

export const AvklartDagLesevisning: FC<{
    avklartDag: AvklartDag | undefined;
}> = ({ avklartDag }) => {
    const erSlettet = avklartDag?.avklartKjørtDagStatus === AvklartKjørtDagStatus.SLETTET;
    const finnClassname = (harVerdi: boolean) =>
        erSlettet && harVerdi ? styles.slettet : undefined;

    return (
        <div className={styles.høyreGrid}>
            <HStack gap="space-4" className={finnClassname(avklartDag !== undefined)}>
                <BodyShort size="small">
                    {avklartDag &&
                        godkjentGjennomførtKjøringTilTekst[avklartDag.godkjentGjennomførtKjøring]}
                </BodyShort>
            </HStack>
            <BodyShort size="small" className={finnClassname(!!avklartDag?.parkeringsutgift)}>
                {kronerEllerStrek(avklartDag?.parkeringsutgift)}
            </BodyShort>
            <BodyShort size="small" className={finnClassname(!!avklartDag?.begrunnelse)}>
                {avklartDag?.begrunnelse || '-'}
            </BodyShort>
            <AvklartKjørtDagStatusTag avklartKjørtDagStatus={avklartDag?.avklartKjørtDagStatus} />
        </div>
    );
};

const AvklartKjørtDagStatusTag: FC<{
    avklartKjørtDagStatus: AvklartKjørtDagStatus | undefined;
}> = ({ avklartKjørtDagStatus }) => {
    switch (avklartKjørtDagStatus) {
        case AvklartKjørtDagStatus.SLETTET:
            return (
                <Tag size="small" data-color="danger">
                    Slettet
                </Tag>
            );
        default:
            return null;
    }
};
