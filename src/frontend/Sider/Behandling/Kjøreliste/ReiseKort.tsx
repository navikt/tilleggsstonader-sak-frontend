import React, { FC } from 'react';

import { Heading } from '@navikt/ds-react';

import { OppsummeringRammevedtak } from './OppsummeringRammevedtak';
import styles from './ReiseKort.module.css';
import { Reisevurdering } from './Reisevurdering/Reisevurdering';
import { ReisevurderingPrivatBil, UkeVurdering } from '../../../typer/kjøreliste';

export const ReiseKort: FC<{
    reisevurdering: ReisevurderingPrivatBil;
    oppdaterReisevurdering: (oppdatertReisevurdering: ReisevurderingPrivatBil) => void;
}> = ({ reisevurdering, oppdaterReisevurdering }) => {
    const oppdaterUke = (oppdatertUke: UkeVurdering) => {
        const oppdaterteUker = reisevurdering.uker.map((uke) =>
            uke.fraDato === oppdatertUke.fraDato ? oppdatertUke : uke
        );
        oppdaterReisevurdering({
            ...reisevurdering,
            uker: oppdaterteUker,
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Heading size="small">{reisevurdering.rammevedtak.aktivitetsadresse}</Heading>
                <OppsummeringRammevedtak rammeForReise={reisevurdering.rammevedtak} />
            </div>
            <div className={styles.innhold}>
                <Reisevurdering reisevurdering={reisevurdering} oppdaterUke={oppdaterUke} />
            </div>
        </div>
    );
};
