import React, { FC } from 'react';

import { BodyShort, HGrid, HStack, Label } from '@navikt/ds-react';

import { formaterNullablePeriode } from '../../../utils/dato';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../utils/fomatering';
import { Vilkår } from '../vilkår';

const LesevisningFremtidigUtgift: FC<{
    vilkår: Vilkår;
    skalViseRedigeringsknapp?: boolean;
    startRedigering?: () => void;
}> = ({ vilkår }) => {
    const { fom, tom, utgift } = vilkår;

    return (
        <HGrid
            gap={{ md: 'space-16', lg: 'space-32' }}
            columns="minmax(auto, 175px) auto minmax(auto, 32px)"
            minHeight={'60px'} //Så redigeringsknappen ikke forsvinner under statusbåndet
        >
            <Label size="small">{formaterNullablePeriode(fom, tom)}</Label>
            <HStack gap="space-16">
                <BodyShort size={'small'}>Fremtidig utgift</BodyShort>
                {utgift && (
                    <BodyShort size="small">
                        {`kr ${formaterTallMedTusenSkilleEllerStrek(utgift)}`}
                    </BodyShort>
                )}
            </HStack>
        </HGrid>
    );
};

export default LesevisningFremtidigUtgift;
