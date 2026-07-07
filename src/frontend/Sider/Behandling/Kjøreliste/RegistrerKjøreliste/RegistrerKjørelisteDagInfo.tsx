import React, { FC } from 'react';

import { BodyShort, Checkbox, CheckboxGroup, TextField } from '@navikt/ds-react';

import { Dag, RegistrertKjørtDagRequest } from '../../../../typer/kjøreliste';
import { formaterIsoDato, ukedagTilKortNorsk } from '../../../../utils/dato';
import { tilHeltall } from '../../../../utils/tall';
import { fjernSpaces } from '../../../../utils/utils';
import styles from '../Reisevurdering/UkeInnhold.module.css';
import { harAvvikPåHellidagEllerHelg, harAvvikPåParkeringsutgift } from '../utils';

export const RegistrerKjørelisteDagInfo: FC<{
    dag: Dag;
    registrertDag: RegistrertKjørtDagRequest | undefined;
    oppdaterDag: (dag: RegistrertKjørtDagRequest) => void;
    kanRedigere: boolean | undefined;
}> = ({ dag, registrertDag, oppdaterDag, kanRedigere }) => {
    const dagHarForHøyParkeringsutgift = harAvvikPåParkeringsutgift(dag);
    const dagHarAvvikPåHellidagEllerHelg = harAvvikPåHellidagEllerHelg(dag);

    const harKjørt = registrertDag?.harKjørt ?? false;
    const parkeringsutgift = registrertDag?.parkeringsutgift;

    const oppdaterHarKjørt = (checked: boolean) => {
        if (!registrertDag) return;
        oppdaterDag({ ...registrertDag, harKjørt: checked });
    };

    const oppdaterParkeringsutgift = (verdi: string) => {
        if (!registrertDag) return;
        oppdaterDag({
            ...registrertDag,
            parkeringsutgift: tilHeltall(fjernSpaces(verdi)),
        });
    };

    return (
        <div className={styles.venstreGrid}>
            <BodyShort size="small">{ukedagTilKortNorsk[dag.ukedag]}</BodyShort>
            <BodyShort size="small">{formaterIsoDato(dag.dato)}</BodyShort>

            <CheckboxGroup legend={''} hideLegend>
                <Checkbox
                    size="small"
                    checked={harKjørt}
                    disabled={!kanRedigere || dag.erDagSlettet}
                    error={dagHarAvvikPåHellidagEllerHelg}
                    onChange={(e) => oppdaterHarKjørt(e.target.checked)}
                >
                    {''}
                </Checkbox>
            </CheckboxGroup>

            <TextField
                label="Parkeringsutgift"
                hideLabel
                size="small"
                value={parkeringsutgift != null ? tilHeltall(parkeringsutgift) : ''}
                onChange={(e) => oppdaterParkeringsutgift(e.target.value)}
                className={styles.maksHøyde}
                disabled={!kanRedigere || dag.erDagSlettet}
                error={dagHarForHøyParkeringsutgift ? ' ' : undefined}
            />
        </div>
    );
};
