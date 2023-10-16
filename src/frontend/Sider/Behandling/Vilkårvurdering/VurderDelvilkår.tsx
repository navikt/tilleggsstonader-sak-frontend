import * as React from 'react';
import { FC } from 'react';

import { Radio, RadioGroup } from '@navikt/ds-react';

import { Regel } from '../../../typer/regel';
import { Vurdering } from '../vilkår';

interface Props {
    regel: Regel;
    vurdering: Vurdering;
    settVurdering: (nyttSvar: Vurdering) => void;
}

const VurderDelvilkår: FC<Props> = ({ regel, vurdering, settVurdering }) => {
    return (
        <RadioGroup legend={regel.regelId} value={vurdering.svar || ''}>
            {Object.keys(regel.svarMapping).map((svarId) => {
                return (
                    <Radio
                        key={`${regel.regelId}_${svarId}`}
                        name={`${regel.regelId}_${svarId}`}
                        value={svarId}
                        onChange={() =>
                            settVurdering({
                                svar: svarId,
                                regelId: regel.regelId,
                            })
                        }
                    >
                        {svarId}
                    </Radio>
                );
            })}
        </RadioGroup>
    );
};

export default VurderDelvilkår;
