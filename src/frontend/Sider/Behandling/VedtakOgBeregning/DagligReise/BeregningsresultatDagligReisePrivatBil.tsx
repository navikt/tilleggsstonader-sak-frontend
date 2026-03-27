import React, { FC } from 'react';

import { DagligReisePrivatBilBeregningsresultatTabell } from './DagligReisePrivatBilBeregningsresultatTabell';
import {
    BeregningsresultatPrivatBil,
    RammevedtakPrivatBil,
} from '../../../../typer/vedtak/vedtakDagligReise';

export const BeregningsresultatDagligReisePrivatBil: FC<{
    beregningsresultat: BeregningsresultatPrivatBil;
    rammevedtakPrivatBil?: RammevedtakPrivatBil;
}> = ({ beregningsresultat, rammevedtakPrivatBil }) => {
    return (
        <div>
            {beregningsresultat.reiser.map((reise) => {
                const rammevedtakForReise = rammevedtakPrivatBil?.reiser.find(
                    (rammevedtak) => rammevedtak.reiseId === reise.reiseId
                );
                return (
                    <DagligReisePrivatBilBeregningsresultatTabell
                        key={reise.reiseId}
                        reise={reise}
                        rammevedtak={rammevedtakForReise}
                    />
                );
            })}
        </div>
    );
};
