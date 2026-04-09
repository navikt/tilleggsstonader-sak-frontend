import React, { FC } from 'react';

import { VStack } from '@navikt/ds-react';

import { BeregningOffentligTransport } from './OffentligTransport';
import { BeregningsresultatRammevedtakPrivatBil } from './Rammevedtak';
import {
    BeregningsresultatDagligReise,
    RammevedtakPrivatBil,
} from '../../../../../../typer/vedtak/vedtakDagligReise';
import { skalViseBeregningsresultat } from '../../../Felles/beregningsplanUtils';
import { GjenbrukForrigeResultatAlert } from '../../../Felles/GjenbrukForrigeResultatAlert';
import { HvorforVisesIkkeFlereEndringerReadMore } from '../../../Felles/HvorforVisesIkkeFlereEndringerReadMore';

interface Props {
    beregningsresultat: BeregningsresultatDagligReise;
    rammevedtakPrivatBil?: RammevedtakPrivatBil;
}

export const Beregningsresultat: FC<Props> = ({ beregningsresultat, rammevedtakPrivatBil }) => {
    const visBeregningsresultat = skalViseBeregningsresultat(beregningsresultat.beregningsplan);

    return (
        <VStack gap="space-16">
            {visBeregningsresultat ? (
                <>
                    {beregningsresultat.offentligTransport && (
                        <BeregningOffentligTransport
                            beregningsresultat={beregningsresultat.offentligTransport}
                        />
                    )}
                    {rammevedtakPrivatBil && (
                        <BeregningsresultatRammevedtakPrivatBil
                            rammevedtak={rammevedtakPrivatBil}
                        />
                    )}
                </>
            ) : (
                <GjenbrukForrigeResultatAlert beregningsplan={beregningsresultat.beregningsplan} />
            )}
            <HvorforVisesIkkeFlereEndringerReadMore
                beregningsplan={beregningsresultat.beregningsplan}
            />
        </VStack>
    );
};
