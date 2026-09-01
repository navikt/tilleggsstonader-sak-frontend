import React, { FC } from 'react';

import { VStack } from '@navikt/ds-react';

import { BeregningOffentligTransport } from './OffentligTransport';
import { BeregningPrivatBil } from './PrivatBil';
import { BeregningReiseOppstartAvslutningHjemreise } from '../../../../../../typer/vedtak/vedtakReiseOppstartAvslutningHjemreise';

interface Props {
    beregningsresultat?: BeregningReiseOppstartAvslutningHjemreise;
}

export const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => {
    return (
        <VStack gap="space-16">
            <>
                {beregningsresultat?.offentligTransport && (
                    <>
                        <BeregningOffentligTransport
                            beregningsresultat={beregningsresultat.offentligTransport}
                        />
                    </>
                )}
                {beregningsresultat?.privatBil && (
                    <>
                        <BeregningPrivatBil beregningsresultat={beregningsresultat.privatBil} />
                    </>
                )}
            </>
        </VStack>
    );
};
