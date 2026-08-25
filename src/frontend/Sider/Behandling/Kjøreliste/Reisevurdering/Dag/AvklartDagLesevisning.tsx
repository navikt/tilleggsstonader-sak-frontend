import React, { FC } from 'react';

import { BodyShort, HStack, Tag } from '@navikt/ds-react';

import {
    AvklartDag,
    AvklartKjørtDagStatus,
    GodkjentGjennomførtKjøring,
} from '../../../../../typer/kjøreliste';
import { kronerEllerStrek } from '../../../../../utils/tekstformatering';
import { godkjentGjennomførtKjøringTilTekst } from '../../utils';
import styles from '../UkeInnhold.module.css';

export const AvklartDagLesevisning: FC<{
    avklartDag: AvklartDag | undefined;
}> = ({ avklartDag }) => {
    const erSlettet = avklartDag?.avklartKjørtDagStatus === AvklartKjørtDagStatus.SLETTET;
    const klasseHvisSlettet = (harVerdi: unknown) =>
        erSlettet && harVerdi ? styles.slettet : undefined;

    return (
        <div className={styles.høyreGrid}>
            <HStack gap="space-6" align="center" className={klasseHvisSlettet(avklartDag)}>
                <BodyShort size="small">
                    {avklartDag &&
                        godkjentGjennomførtKjøringTilTekst[avklartDag.godkjentGjennomførtKjøring]}
                </BodyShort>
                {avklartDag?.godkjentGjennomførtKjøring === GodkjentGjennomførtKjøring.JA && (
                    <span className={styles.grønnSirkel} />
                )}
            </HStack>
            <BodyShort size="small" className={klasseHvisSlettet(avklartDag?.parkeringsutgift)}>
                {kronerEllerStrek(avklartDag?.parkeringsutgift)}
            </BodyShort>
            <BodyShort size="small" className={klasseHvisSlettet(avklartDag?.begrunnelse)}>
                {avklartDag?.begrunnelse || '-'}
            </BodyShort>
            {avklartDag?.avklartKjørtDagStatus === AvklartKjørtDagStatus.SLETTET && (
                <Tag size="small" data-color="danger">
                    Slettet
                </Tag>
            )}
        </div>
    );
};
