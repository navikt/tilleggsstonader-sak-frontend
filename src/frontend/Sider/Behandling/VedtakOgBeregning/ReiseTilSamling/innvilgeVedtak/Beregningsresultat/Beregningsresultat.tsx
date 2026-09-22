import React, { FC, useState } from 'react';

import { HStack, Switch, VStack } from '@navikt/ds-react';

import { BeregningOffentligTransport } from './OffentligTransport';
import { BeregningPrivatBil } from './PrivatBil';
import { BeregningResultatReiseTilSamling } from '../../../../../../typer/vedtak/vedtakReiseTilSamling';

interface Props {
    beregningsresultat?: BeregningResultatReiseTilSamling;
}

export const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => {
    const [visTidligerePerioder, setVisTidligerePerioder] = useState(false);

    const harPerioderFraTidligereVedtak =
        (beregningsresultat?.offentligTransport ?? []).some(
            (samling) => samling.fraTidligereVedtak
        ) || (beregningsresultat?.privatBil ?? []).some((samling) => samling.fraTidligereVedtak);

    return (
        <VStack gap="space-16">
            {harPerioderFraTidligereVedtak && (
                <HStack justify="end">
                    <Switch
                        position="left"
                        size="small"
                        checked={visTidligerePerioder}
                        onChange={() => setVisTidligerePerioder((prev) => !prev)}
                    >
                        Vis upåvirkede perioder
                    </Switch>
                </HStack>
            )}
            <>
                {beregningsresultat?.offentligTransport && (
                    <>
                        <BeregningOffentligTransport
                            beregningsresultat={beregningsresultat.offentligTransport}
                            visTidligerePerioder={visTidligerePerioder}
                        />
                    </>
                )}
                {beregningsresultat?.privatBil && (
                    <>
                        <BeregningPrivatBil
                            beregningsresultat={beregningsresultat.privatBil}
                            visTidligerePerioder={visTidligerePerioder}
                        />
                    </>
                )}
            </>
        </VStack>
    );
};
