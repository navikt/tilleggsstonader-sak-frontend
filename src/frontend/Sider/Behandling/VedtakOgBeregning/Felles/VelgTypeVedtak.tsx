import React, { FC } from 'react';

import { HStack, Radio, RadioGroup } from '@navikt/ds-react';

import { useSteg } from '../../../../context/StegContext';
import { TypeVedtak } from '../../../../typer/vedtak';

interface Props {
    typeVedtak?: TypeVedtak;
    settTypeVedtak: (val: TypeVedtak | undefined) => void;
}

const VelgTypeVedtak: FC<Props> = ({ typeVedtak, settTypeVedtak }) => {
    const { erStegRedigerbart } = useSteg();

    return (
        <RadioGroup
            legend="Vedtaksresultat"
            value={typeVedtak}
            onChange={(e) => {
                settTypeVedtak(e as TypeVedtak);
            }}
            readOnly={!erStegRedigerbart}
        >
            <HStack gap="4">
                <Radio value={TypeVedtak.INNVILGELSE}>Innvilgelse</Radio>
                <Radio value={TypeVedtak.AVSLAG}>Avslag</Radio>
            </HStack>
        </RadioGroup>
    );
};

export default VelgTypeVedtak;
