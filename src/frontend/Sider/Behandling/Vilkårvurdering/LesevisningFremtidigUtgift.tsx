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
            gap={{ md: '4', lg: '8' }}
            columns="minmax(auto, 175px) auto minmax(auto, 32px)"
            minHeight={'60px'} //Så redigeringsknappen ikke forsvinner under statusbåndet
        >
            <Label size="small">{formaterNullablePeriode(fom, tom)}</Label>
            <HStack gap="4">
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
