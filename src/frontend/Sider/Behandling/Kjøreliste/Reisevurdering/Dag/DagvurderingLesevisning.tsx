import React, { FC } from 'react';

import { Checkbox, TextField } from '@navikt/ds-react';

import { RedigerbarAvklartDag } from '../../../../../typer/kjøreliste';
import { tilHeltall } from '../../../../../utils/tall';
import { fjernSpaces } from '../../../../../utils/utils';
import styles from '../UkeInnhold.module.css';

export const RedigerAvklartsDag: FC<{
    dag: RedigerbarAvklartDag;
    oppdaterDag: (dag: RedigerbarAvklartDag) => void;
}> = ({ dag, oppdaterDag }) => {
    const oppdaterParkeringsutgift = (verdi: string) => {
        oppdaterDag({
            ...dag,
            parkeringsutgift: tilHeltall(fjernSpaces(verdi)),
        });
    };

    const oppdaterGodkjentGjennomførtKjøring = (harKjørt: boolean) => {
        oppdaterDag({
            ...dag,
            godkjentGjennomførtKjøring: harKjørt,
        });
    };

    const oppdaterBegrunnelse = (begrunnelse: string) => {
        oppdaterDag({
            ...dag,
            begrunnelse: begrunnelse,
        });
    };

    return (
        <div className={styles.høyreGrid}>
            <Checkbox
                size="small"
                checked={dag.godkjentGjennomførtKjøring}
                onChange={(e) => oppdaterGodkjentGjennomførtKjøring(e.target.checked)}
            >
                Dekkes
            </Checkbox>

            <TextField
                label="Parkeringsutgift"
                hideLabel
                size="small"
                value={dag.parkeringsutgift ? tilHeltall(dag.parkeringsutgift) : undefined}
                onChange={(e) => oppdaterParkeringsutgift(e.target.value)}
            />

            <TextField
                label="Kommentar"
                hideLabel
                size="small"
                value={dag.begrunnelse || ''}
                onChange={(e) => oppdaterBegrunnelse(e.target.value)}
            />
        </div>
    );
};
