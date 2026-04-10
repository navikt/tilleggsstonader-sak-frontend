import React, { FC } from 'react';

import { VStack } from '@navikt/ds-react';

import { BeregningOffentligTransport } from './OffentligTransport';
import { BeregningsresultatRammevedtakPrivatBil } from './Rammevedtak';
import {
    BeregningsresultatDagligReise,
    RammevedtakPrivatBil,
} from '../../../../../../typer/vedtak/vedtakDagligReise';
import { GjenbrukForrigeResultatAlert } from '../../../Felles/GjenbrukForrigeResultatAlert';
import { HvorforVisesIkkeFlereEndringerReadMore } from '../../../Felles/HvorforVisesIkkeFlereEndringerReadMore';

interface Props {
    beregningsresultat: BeregningsresultatDagligReise;
    rammevedtakPrivatBil?: RammevedtakPrivatBil;
}

export const Beregningsresultat: FC<Props> = ({ beregningsresultat, rammevedtakPrivatBil }) => {
    return (
        <VStack gap="space-16">
            <>
                {beregningsresultat.offentligTransport && (
                    <>
                        <GjenbrukForrigeResultatAlert
                            beregningsplan={beregningsresultat.beregningsplan}
                        />
                        <BeregningOffentligTransport
                            beregningsresultat={beregningsresultat.offentligTransport}
                        />
                    </>
                )}
                {rammevedtakPrivatBil && (
                    <BeregningsresultatRammevedtakPrivatBil rammevedtak={rammevedtakPrivatBil} />
                )}
            </>
            <HvorforVisesIkkeFlereEndringerReadMore
                beregningsplan={beregningsresultat.beregningsplan}
            />
        </VStack>
    );
};
