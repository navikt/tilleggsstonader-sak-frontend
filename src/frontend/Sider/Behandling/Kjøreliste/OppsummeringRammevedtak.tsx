import React, { FC } from 'react';

import { Label, BodyShort } from '@navikt/ds-react';

import styles from './OppsummeringRammevedtak.module.css';
import { RammeForReiseMedPrivatBil } from '../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoPeriode } from '../../../utils/dato';

export const OppsummeringRammevedtak: FC<{
    rammeForReise: RammeForReiseMedPrivatBil;
}> = ({ rammeForReise }) => {
    return (
        <div className={styles.grid}>
            <Label size="small">Periode</Label>
            <Label size="small">Reisedager per uke</Label>
            <Label size="small">Reiseavstand én vei</Label>
            <Label size="small">Sats</Label>
            <Label size="small">Bom én vei</Label>
            <Label size="small">Ferge én vei</Label>
            <Label size="small">Dagsats u/park.</Label>
            <BodyShort size="small">
                {formaterIsoPeriode(rammeForReise.fom, rammeForReise.tom)}
            </BodyShort>
            <BodyShort size="small">{rammeForReise.reisedagerPerUke}</BodyShort>
            <BodyShort size="small">{rammeForReise.reiseavstandEnVei} km</BodyShort>
            <BodyShort size="small">{rammeForReise.kilometersats} kr</BodyShort>
            <BodyShort size="small">{rammeForReise.dagsatsUtenParkering} kr</BodyShort>
            <BodyShort size="small">
                {rammeForReise.bompengerEnVei ? `${rammeForReise.bompengerEnVei} kr` : '-'}
            </BodyShort>
            <BodyShort size="small">
                {rammeForReise.fergekostnadEnVei ? `${rammeForReise.fergekostnadEnVei} kr` : '-'}
            </BodyShort>
        </div>
    );
};
