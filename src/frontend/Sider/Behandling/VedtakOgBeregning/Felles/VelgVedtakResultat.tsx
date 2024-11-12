import React, { FC } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { Radio, RadioGroup } from '@navikt/ds-react';

import { useSteg } from '../../../../context/StegContext';
import { TypeVedtak } from '../../../../typer/vedtak';
import { Toggle } from '../../../../utils/toggles';

interface Props {
    typeVedtak?: TypeVedtak;
    settTypeVedtak: (val: TypeVedtak | undefined) => void;
}

const VelgVedtakResultat: FC<Props> = ({ typeVedtak, settTypeVedtak }) => {
    const { erStegRedigerbart } = useSteg();
    const opphør = useFlag(Toggle.OPPHØR);

    return (
        <RadioGroup
            legend="Vedtaksresultat"
            value={typeVedtak || ''}
            onChange={(e) => {
                settTypeVedtak(e as TypeVedtak);
            }}
            readOnly={!erStegRedigerbart}
            size="small"
        >
            <Radio value={TypeVedtak.INNVILGELSE}>Innvilgelse</Radio>
            <Radio value={TypeVedtak.AVSLAG}>Avslag</Radio>
            {opphør && <Radio value={TypeVedtak.OPPHØR}>Opphør</Radio>}
        </RadioGroup>
    );
};

export default VelgVedtakResultat;
