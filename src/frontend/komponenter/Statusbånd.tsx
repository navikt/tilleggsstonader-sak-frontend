import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import styles from './Statusbånd.module.css';
import { PeriodeStatus } from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { classNames } from '../utils/classNames';
import { formaterEnumVerdi } from '../utils/tekstformatering';

export const Statusbånd: React.FC<{ status?: PeriodeStatus }> = ({ status }) => {
    if (!status) return null;

    const statusStyle = {
        [PeriodeStatus.NY]: styles.ny,
        [PeriodeStatus.ENDRET]: styles.endret,
        [PeriodeStatus.SLETTET]: styles.slettet,
        [PeriodeStatus.UENDRET]: undefined,
    }[status];

    if (!statusStyle) {
        return null;
    }

    return (
        <div className={classNames([styles.ribbon, statusStyle])}>
            <BodyShort size="small">{formaterEnumVerdi(status)}</BodyShort>
        </div>
    );
};
