import React, { FC } from 'react';

import { ArrowDownIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import styles from './SorterKjørelisteKnapp.module.css';
import { hentRammevedtakForVurdering } from './utils';
import { ReisevurderingPrivatBil } from '../../../typer/kjøreliste';

export type Sorteringsretning = 'nyest' | 'eldst';

export function sorterReisevurderinger(
    reisevurderinger: ReisevurderingPrivatBil[],
    sortering: Sorteringsretning
): ReisevurderingPrivatBil[] {
    const sorterteReisevurderinger = reisevurderinger.toSorted((a, b) => {
        const rammeA = hentRammevedtakForVurdering(a);
        const rammeB = hentRammevedtakForVurdering(b);

        return rammeA.tom.localeCompare(rammeB.tom);
    });

    return sortering === 'nyest' ? sorterteReisevurderinger.reverse() : sorterteReisevurderinger;
}

interface Props {
    sortering: Sorteringsretning;
    settSortering: React.Dispatch<React.SetStateAction<Sorteringsretning>>;
}

export const SorterKjørelisteKnapp: FC<Props> = ({ sortering, settSortering }) => (
    <Button
        icon={
            <ArrowDownIcon
                aria-hidden
                className={`${styles.pil}${sortering === 'eldst' ? ` ${styles.pilSnudd}` : ''}`}
            />
        }
        iconPosition="left"
        onClick={() => settSortering((prev) => (prev === 'nyest' ? 'eldst' : 'nyest'))}
        size="small"
        variant="secondary"
        className={styles.knapp}
    >
        {sortering === 'nyest' ? 'Nyest først' : 'Eldst først'}
    </Button>
);
