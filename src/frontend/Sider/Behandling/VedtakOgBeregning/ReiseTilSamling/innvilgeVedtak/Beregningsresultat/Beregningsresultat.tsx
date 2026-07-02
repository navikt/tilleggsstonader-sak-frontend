import React, { FC } from 'react';

import { VStack } from '@navikt/ds-react';

import { BeregningOffentligTransport } from './OffentligTransport';
import { BeregningsresultatOffentligTransport } from '../../../../../../typer/vedtak/vedtakReiseTilSamling';

interface Props {
    beregningsresultat?: BeregningsresultatOffentligTransport;
}

export const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => {
    return (
        <VStack gap="space-16">
            <>
                {beregningsresultat?.samling && (
                    <>
                        <BeregningOffentligTransport
                            beregningsresultat={beregningsresultat.samling}
                        />
                    </>
                )}
            </>
        </VStack>
    );
};
