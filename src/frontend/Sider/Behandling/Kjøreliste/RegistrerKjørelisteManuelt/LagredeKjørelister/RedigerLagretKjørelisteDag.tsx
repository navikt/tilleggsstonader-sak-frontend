import React, { FC } from 'react';

import { BodyShort, Checkbox, TextField } from '@navikt/ds-react';

import { finnForkortetUkedagFraDato, formaterIsoDato } from '../../../../../utils/dato';
import { tilHeltall } from '../../../../../utils/tall';
import { fjernSpaces } from '../../../../../utils/utils';
import { KjørelisteDag } from '../typer';

export const RedigerLagretKjørelisteDag: FC<{
    dag: KjørelisteDag;
    oppdaterDag: (oppdatertDag: KjørelisteDag) => void;
}> = ({ dag, oppdaterDag }) => {
    const oppdaterHarKjørt = (harKjørt: boolean) => {
        oppdaterDag({ ...dag, harKjørt });
    };

    const oppdaterParkeringsutgift = (parkeringsutgift: string) => {
        oppdaterDag({
            ...dag,
            parkeringsutgift: tilHeltall(fjernSpaces(parkeringsutgift)),
        });
    };

    return (
        <>
            <BodyShort size="small">{finnForkortetUkedagFraDato(dag.dato)}</BodyShort>
            <BodyShort size="small">{formaterIsoDato(dag.dato)}</BodyShort>
            <Checkbox
                size="small"
                checked={dag.harKjørt}
                onChange={(e) => oppdaterHarKjørt(e.target.checked)}
            >
                {dag.harKjørt ? 'Ja' : 'Nei'}
            </Checkbox>
            <TextField
                value={dag.parkeringsutgift ?? ''}
                onChange={(e) => oppdaterParkeringsutgift(e.target.value)}
                size="small"
                label="Parkeringskostnad"
                hideLabel
            />
        </>
    );
};
