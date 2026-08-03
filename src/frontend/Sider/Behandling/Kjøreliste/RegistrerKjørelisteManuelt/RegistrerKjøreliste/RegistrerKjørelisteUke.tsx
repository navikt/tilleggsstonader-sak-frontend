import React, { FC } from 'react';

import { Box, Checkbox } from '@navikt/ds-react';

import { RegistrerKjørelisteDag } from './RegistrerKjørelisteDag';
import { DagTilInnsending, UkeTilInnsending } from './typer';
import { formaterIsoPeriode } from '../../../../../utils/dato';
import { UkeGrid } from '../UkeGrid';

export const RegistrerKjørelisteUke: FC<{
    uke: UkeTilInnsending;
    oppdaterUke: (oppdatertUke: UkeTilInnsending) => void;
}> = ({ uke, oppdaterUke }) => {
    const oppdaterSkalSendesInn = (skalSendesInn: boolean) => {
        oppdaterUke({
            ...uke,
            skalSendesInn: skalSendesInn,
        });
    };

    const oppdaterDag = (oppdatertDag: DagTilInnsending) => {
        oppdaterUke({
            ...uke,
            dager: uke.dager?.map((dag) => (dag.dato === oppdatertDag.dato ? oppdatertDag : dag)),
        });
    };

    return (
        <div key={uke.ukenummer}>
            <Checkbox
                disabled={uke.innsendtTidligere}
                checked={uke.skalSendesInn}
                onChange={(e) => oppdaterSkalSendesInn(e.target.checked)}
                size="small"
                indeterminate={uke.innsendtTidligere}
            >
                Uke {uke.ukenummer} ({formaterIsoPeriode(uke.fom, uke.tom)}){' '}
                {uke.innsendtTidligere && ' - innsendt tidligere'}
            </Checkbox>
            {uke.skalSendesInn && uke.dager && (
                <Box marginBlock="space-16" padding="space-16" background="default">
                    <UkeGrid>
                        {uke.dager.map((dag) => (
                            <RegistrerKjørelisteDag
                                dag={dag}
                                key={dag.dato}
                                oppdaterDag={oppdaterDag}
                            />
                        ))}
                    </UkeGrid>
                </Box>
            )}
        </div>
    );
};
