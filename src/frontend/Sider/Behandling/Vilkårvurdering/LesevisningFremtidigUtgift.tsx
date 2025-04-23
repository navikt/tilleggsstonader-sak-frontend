import React, { FC } from 'react';

import { styled } from 'styled-components';

import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, HGrid, HStack, Label } from '@navikt/ds-react';

import SmallButton from '../../../komponenter/Knapper/SmallButton';
import { formaterNullablePeriode } from '../../../utils/dato';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../utils/fomatering';
import { Vilkår } from '../vilkår';

const Redigeringsknapp = styled(SmallButton)`
    max-height: 24px;
    align-self: end;
    margin-left: auto;
`;

const LesevisningFremtidigUtgift: FC<{
    vilkår: Vilkår;
    skalViseRedigeringsknapp?: boolean;
    startRedigering?: () => void;
}> = ({ vilkår, startRedigering, skalViseRedigeringsknapp }) => {
    const { fom, tom, utgift } = vilkår;

    return (
        <HGrid gap={{ md: '4', lg: '8' }} columns="minmax(auto, 175px) auto minmax(auto, 32px)">
            <Label size="small">{formaterNullablePeriode(fom, tom)}</Label>
            <HStack gap="4">
                <BodyShort size={'small'}>Fremtidig utgift</BodyShort>
                {utgift && (
                    <BodyShort size="small">
                        {`kr ${formaterTallMedTusenSkilleEllerStrek(utgift)}`}
                    </BodyShort>
                )}
            </HStack>
            {skalViseRedigeringsknapp && (
                <Redigeringsknapp
                    variant="tertiary"
                    onClick={startRedigering}
                    icon={<PencilIcon />}
                />
            )}
        </HGrid>
    );
};

export default LesevisningFremtidigUtgift;
