import React, { FC } from 'react';

import { Checkbox, CheckboxGroup, Textarea, TextField } from '@navikt/ds-react';

import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { GodkjentGjennomførtKjøring, RedigerbarAvklartDag } from '../../../../../typer/kjøreliste';
import { tilHeltall } from '../../../../../utils/tall';
import { fjernSpaces } from '../../../../../utils/utils';
import { godkjentGjennomførtKjøringTilTekst } from '../../utils';
import styles from '../UkeInnhold.module.css';

export const RedigerAvklartDag: FC<{
    dag: RedigerbarAvklartDag;
    erSlettetDagFraRammevedtak: boolean;
    oppdaterDag: (dag: RedigerbarAvklartDag) => void;
    feil: FormErrors<RedigerbarAvklartDag> | undefined;
}> = ({ dag, erSlettetDagFraRammevedtak, oppdaterDag, feil }) => {
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
        <div className={styles.høyreGridRedigering}>
            <CheckboxGroup legend="Status" hideLegend error={feil?.godkjentGjennomførtKjøring}>
                <Checkbox
                    size="small"
                    disabled={erSlettetDagFraRammevedtak}
                    indeterminate={
                        dag.godkjentGjennomførtKjøring === GodkjentGjennomførtKjøring.IKKE_VURDERT
                    }
                    checked={dag.godkjentGjennomførtKjøring === GodkjentGjennomførtKjøring.JA}
                    data-color={
                        dag.godkjentGjennomførtKjøring === GodkjentGjennomførtKjøring.IKKE_VURDERT
                            ? 'neutral'
                            : undefined
                    }
                    onChange={(e) => oppdaterGodkjentGjennomførtKjøring(e.target.checked)}
                    error={!!feil?.godkjentGjennomførtKjøring}
                >
                    {godkjentGjennomførtKjøringTilTekst[dag.godkjentGjennomførtKjøring]}
                </Checkbox>
            </CheckboxGroup>

            <TextField
                label="Parkeringsutgift"
                hideLabel
                size="small"
                disabled={erSlettetDagFraRammevedtak}
                value={dag.parkeringsutgift ? tilHeltall(dag.parkeringsutgift) : ''}
                onChange={(e) => oppdaterParkeringsutgift(e.target.value)}
                error={feil?.parkeringsutgift}
                className={styles.maksHøyde}
            />
            <Textarea
                label="Kommentar"
                hideLabel
                size="small"
                disabled={erSlettetDagFraRammevedtak}
                resize
                minRows={1}
                value={dag.begrunnelse || ''}
                onChange={(e) => oppdaterBegrunnelse(e.target.value)}
                error={feil?.begrunnelse}
            />
        </div>
    );
};
