import React, { FC } from 'react';

import { Checkbox, CheckboxGroup, TextField } from '@navikt/ds-react';

import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { GodkjentGjennomførtKjøring, RedigerbarAvklartDag } from '../../../../../typer/kjøreliste';
import { tilHeltall } from '../../../../../utils/tall';
import { fjernSpaces } from '../../../../../utils/utils';
import styles from '../UkeInnhold.module.css';

export const RedigerAvklartDag: FC<{
    dag: RedigerbarAvklartDag;
    oppdaterDag: (dag: RedigerbarAvklartDag) => void;
    feil: FormErrors<RedigerbarAvklartDag> | undefined;
}> = ({ dag, oppdaterDag, feil }) => {
    const oppdaterParkeringsutgift = (verdi: string) => {
        oppdaterDag({
            ...dag,
            parkeringsutgift: tilHeltall(fjernSpaces(verdi)),
        });
    };

    const oppdaterGodkjentGjennomførtKjøring = (harKjørt: boolean) => {
        oppdaterDag({
            ...dag,
            godkjentGjennomførtKjøring: harKjørt
                ? GodkjentGjennomførtKjøring.JA
                : GodkjentGjennomførtKjøring.NEI,
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
            <CheckboxGroup
                legend="Kjøring dekkes"
                hideLegend
                error={feil?.godkjentGjennomførtKjøring}
            >
                <Checkbox
                    size="small"
                    indeterminate={
                        dag.godkjentGjennomførtKjøring === GodkjentGjennomførtKjøring.IKKE_VURDERT
                    }
                    checked={dag.godkjentGjennomførtKjøring === GodkjentGjennomførtKjøring.JA}
                    onChange={(e) => oppdaterGodkjentGjennomførtKjøring(e.target.checked)}
                    error={!!feil?.godkjentGjennomførtKjøring}
                >
                    Dekkes
                </Checkbox>
            </CheckboxGroup>

            <TextField
                label="Parkeringsutgift"
                hideLabel
                size="small"
                value={dag.parkeringsutgift ? tilHeltall(dag.parkeringsutgift) : undefined}
                onChange={(e) => oppdaterParkeringsutgift(e.target.value)}
                error={feil?.parkeringsutgift}
            />

            <TextField
                label="Kommentar"
                hideLabel
                size="small"
                value={dag.begrunnelse || ''}
                onChange={(e) => oppdaterBegrunnelse(e.target.value)}
                error={feil?.begrunnelse}
            />
        </div>
    );
};
