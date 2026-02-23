import React, { FC } from 'react';

import { Heading } from '@navikt/ds-react';

import { OppsummeringRammevedtak } from './OppsummeringRammevedtak';
import styles from './ReiseKort.module.css';
import { Reisevurdering } from './Reisevurdering/Reisevurdering';
import { ReisevurderingPrivatBil } from '../../../typer/kjøreliste';
import { RammeForReiseMedPrivatBil } from '../../../typer/vedtak/vedtakDagligReise';

export const ReiseKort: FC<{
    rammeForReise: RammeForReiseMedPrivatBil;
    reisevurderinger: ReisevurderingPrivatBil[];
}> = ({ rammeForReise, reisevurderinger }) => {
    const reisevurdering = reisevurderinger.find((r) => r.reiseId === rammeForReise.reiseId);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Heading size="small">
                    <u>{rammeForReise.aktivitetsadresse}</u>
                </Heading>
                <OppsummeringRammevedtak rammeForReise={rammeForReise} />
            </div>
            <div className={styles.innhold}>
                <Reisevurdering kjøreliste={reisevurdering} />
            </div>
        </div>
    );
};
