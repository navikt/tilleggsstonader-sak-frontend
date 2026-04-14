import React, { FC } from 'react';

import { BodyShort, Label } from '@navikt/ds-react';

import styles from './OppsummeringRammevedtak.module.css';
import { RammeForReiseMedPrivatBil } from '../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoPeriode } from '../../../utils/dato';

export const OppsummeringRammevedtak: FC<{
    rammeForReise: RammeForReiseMedPrivatBil;
}> = ({ rammeForReise }) => {
    return (
        <div className={styles.grid}>
            <Label size="small">Periode</Label>
            <Label size="small">Reiseavstand én vei</Label>
            <BodyShort size="small">
                {formaterIsoPeriode(rammeForReise.fom, rammeForReise.tom)}
            </BodyShort>
            <BodyShort size="small">{rammeForReise.reiseavstandEnVei} km</BodyShort>
        </div>
    );
};
