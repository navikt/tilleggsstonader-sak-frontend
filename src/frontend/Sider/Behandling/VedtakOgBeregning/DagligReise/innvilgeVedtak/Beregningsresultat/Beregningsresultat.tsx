import React, { FC } from 'react';

import { BeregningOffentligTransport } from './OffentligTransport';
import { BeregningsresultatRammevedtakPrivatBil } from './Rammevedtak';
import {
    BeregningsresultatDagligReise,
    RammevedtakPrivatBil,
} from '../../../../../../typer/vedtak/vedtakDagligReise';

interface Props {
    beregningsresultat: BeregningsresultatDagligReise;
    rammevedtakPrivatBil?: RammevedtakPrivatBil;
}

export const Beregningsresultat: FC<Props> = ({ beregningsresultat, rammevedtakPrivatBil }) => {
    return (
        <>
            {beregningsresultat.offentligTransport && (
                <BeregningOffentligTransport
                    beregningsresultat={beregningsresultat.offentligTransport}
                />
            )}
            {rammevedtakPrivatBil && (
                <BeregningsresultatRammevedtakPrivatBil rammevedtak={rammevedtakPrivatBil} />
            )}
        </>
    );
};
